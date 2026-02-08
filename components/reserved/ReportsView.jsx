import React, { useEffect, useState } from 'react';
import { apiCall } from '../../utils/apiConfig';

export default function ReportsView({ showAlert, showConfirm }) {
    const [search, setSearch] = useState('');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function deleteReport(id) {
        if (await showConfirm("Are you sure that you want to delete this report?")) {
            let isDeleted = false;

            try {
                const formData = new FormData();
                formData.append("id", id);

                const data = await apiCall(`/api/deleteReportAdmin`, {
                    method: "POST",
                    body: formData
                });

                if (data) {
                    if (!data["success"]) {
                        throw new Error(data["error"]);
                    }
                    else {
                        isDeleted = true;
                    }
                }
                else {
                    throw new Error("generic_error_in_delete_report");
                }
            } catch (error) {
                console.error(error);
                await showAlert("Error deleting report.");
            }

            if (isDeleted) {
                setData((prev) => prev.filter((item) => item.id !== id));
            }
        }
    }

    useEffect(() => {
        const controller = new AbortController();
        let ignore = false;

        async function load() {
            setLoading(true);
            setError(null);

            try {
                const formData = new FormData();
                formData.append('search', search);

                const json = await apiCall('/api/getReportsDataForReservedArea', {
                    method: 'POST',
                    body: formData,
                    signal: controller.signal
                });

                if (ignore) {
                    return
                }

                if (!json?.success) {
                    throw new Error(json?.error || 'Request failed');
                }

                setData(Array.isArray(json.data) ? json.data : []);
            } catch (error) {
                if (error.name === 'AbortError') {
                    return
                }

                setError(error.message || 'Request failed');
                setData([]);
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        }

        load();

        return () => {
            ignore = true;
            controller.abort();
        };
    }, [search])

    return (
        <div style={{width: "100%"}}>
            <section id="searchSectionInReservedArea">
                <input
                    type="search"
                    placeholder="Search"
                    id="searchReservedArea"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </section>

            {loading && <p>Loading reports...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <ul>
                {data.map((report) => (
                    <li key={report.id} className="ideaBox reservedAreaLiBoxInfo">
                        <p className="ideaAuthorSrc">ID: {report.id}</p>
                        <p className="ideaAuthorSrc">Author id: {report.authorid}</p>
                        <p className="ideaAuthorSrc">{report.ideaid !== 0 ? `Idea id: ${report.ideaid}` : `Account id: ${report.accountid}`}</p>
                        <p className="ideaAuthorSrc">{report.feedback}</p>
                        <img className='deleteReportsAdmin' alt='Delete report' src='/images/delete.svg' onClick={() => deleteReport(report.id)} />
                    </li>
                ))}
            </ul>
        </div>
    )
}