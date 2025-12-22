import React, { useEffect, useState } from 'react'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import Head from '../../components/Head'
import { useAppContext } from '../../contexts/CommonContext'

// Server-side rendering for initial data
export async function getServerSideProps(context) {
    const { id } = context.query;
    let ideaData = null;
    let pageTitle = 'Idea';
    
    try {
        const formData = new FormData();
        formData.append("id", id);

        const response = await fetch('http://localhost:8000/api/data.php', {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        
        if (data && data.success !== false) {
            ideaData = data;
            pageTitle = ideaData['idea'][0]['title'];
        }
        else {
            throw new Error("PHP API error: " + data.error);
        }
    } catch (error) {
        console.error('Failed to fetch ideas:', error);
    }

    return {
        props: {
            ideaData: ideaData,
            pageTitle: pageTitle
        }
    }
}

// Internal functions
function PrintAdditionalInfo({ ideaData }) {
    if (ideaData && ideaData['info'] && ideaData['info'].length != 0) {
        return (
            <ul id='imagesInfo'>
                {
                    ideaData['info'].map((ideaInfo, index) => (
                        <li key={index} className='imageInfoLi'>
                            <img src={ideaInfo['updtimage']} alt='Image of additional info' className='imageInfo' />
                            <div>
                                <h3 className='titleImageInfo'>{ideaInfo['title']}</h3>
                            
                                <p className='imageInfoDescription'>
                                    {ideaInfo['description']}
                                </p>
                            </div>
                        </li>
                    ))
                }
            </ul>
        );
    }

    return null;
}

function PrintDownloadLink({ ideaData }) {
    if (ideaData && ideaData['idea'][0]['downloadlink']) {
        const link = ideaData['idea'][0]['downloadlink'];

        return (
            <section id='downloadSection'>
                <h3 id='download'>External Link</h3>
                <a id='buttonlink' href={link}><button id='downloadButton'>{link}</button></a>
            </section>
        );
    }
    
    return null;
}

function PrintDevLogs({ ideaData }) {
    if (ideaData && ideaData['log'] && ideaData['log'].length != 0) {
        return (
            <section id='devLogsSection'>
                <h3 id='logsName'>Author's Log</h3>
                <ul id='logsList'>
                    {
                        ideaData['log'].map((ideaLog, index) => (
                            <li key={index} className='log'>
                                <div className='logTitleAndData'>
                                    <h4 className='logTitle'>{ideaLog['title']}</h4>
                                    <div className='data'>{ideaLog['data']}</div>
                                </div>
                            
                                <p className='logInfo'>
                                    {ideaLog['description']}
                                </p>
                            </li>
                        ))
                    }
                </ul>
            </section>
        );
    }
    return null;
}

function PrintComments({ ideaData }) {
    if (!ideaData || !ideaData['comment']) {
        return (
            <li className='comment' data-value='rootComment'>
                <p className='replyComment'>Write the first comment!</p>
            </li>
        );
    }

    if (ideaData['comment'].length == 0) {
        return (
            <li className='comment' data-value='rootComment'>
                <p className='replyComment'>Write the first comment!</p>
            </li>
        );
    }

    const printSubCommentRecursive = (superi, indexOfSubComments) => {
        let subCommentsToPrint = [];

        for (let i = indexOfSubComments.length - 1; i >= 0; i--) {
            if (ideaData['comment'][indexOfSubComments[i]]['superCommentid'] == ideaData['comment'][superi]['id']) {
                subCommentsToPrint.push(indexOfSubComments[i]);
                indexOfSubComments.splice(i, 1);
            }
        }

        return printComment(superi, subCommentsToPrint, indexOfSubComments);
    }

    const printComment = (i, subComments, indexOfSubComments) => {
        let authorid = ideaData['comment'][i]['authorid'];
        let accountLink = ideaData['comment'][i]['public'] == 1 ? `./accountVoid.php?account=${authorid}` : "";
        let accountimg = ideaData['comment'][i]['userimage'] != null ? ideaData['comment'][i]['userimage'] : "./images/user.svg";
        let accountUsername = ideaData['comment'][i]['username'] == null ? 'Deleted' : ideaData['comment'][i]['username'];
        let date = ideaData['comment'][i]['data'];
        let description = ideaData['comment'][i]['description'];
        let id = ideaData['comment'][i]['id'];

        return (
            <li key={id} className='comment'>
                <div className='userInfo'>
                    <a href={accountLink} className='writerPage'>
                        <img src={accountimg} alt='Comment Author Account Image' className='writerImg' />
                        <div className='writerUserName'>{accountUsername}:</div>
                    </a>

                    <div className='dataWriter'>{date}</div>
                </div>
                <p className='commentText'>{description}</p>
                <p className='replyComment'>Reply</p>

                <ul className='underComments' data-id={id}>
                    {
                        subComments.map(subCommentIndex => printSubCommentRecursive(subCommentIndex, indexOfSubComments))
                    }
                </ul>
            </li>
        );
    }

    let indexOfRootComments = [];
    let indexOfSubComments = [];

    for (let i = 0; i < ideaData['comment'].length; i++) {
        if (ideaData['comment'][i]['superCommentid'] === null) {
            indexOfRootComments.push(i);
        }
        else {
            indexOfSubComments.push(i);
        }
    }

    return (
        <>
            {indexOfRootComments.map(j => printSubCommentRecursive(j, [...indexOfSubComments]))}
            <li className='comment' data-value='rootComment'>
                <p className='replyComment'>Write a comment!</p>
            </li>
        </>
    );
}

function LicenseSection({ ideaData }) {
    const [licenseUrl, setLicenseUrl] = useState(null);

    useEffect(() => {
        async function getLicense() {
            try {
                if (ideaData && ideaData['idea'][0]['license']) {
                    setLicenseUrl(ideaData['idea'][0]['license']);
                }
                else if (ideaData && ideaData['idea'][0]['title']) {
                    const title = ideaData['idea'][0]['title'];
                    const author = ideaData['idea'][0]['accountName'];

                    const formData = new FormData();
                    formData.append("title", title);
                    formData.append("author", author);

                    const response = await fetch("/api/getFreeIdeasLicense.php", {
                        credentials: "include",
                        method: "POST",
                        body: formData
                    });

                    const data = await response.json();

                    if (data && data[0]) {
                        setLicenseUrl(data[0]);
                    }
                    else {
                        console.error('License API error: '+data['error']);
                    }
                }
            } catch (error) {
                console.error(error);
            }
        }

        getLicense();
    }, [ideaData?.idea?.[0]?.license, ideaData?.idea?.[0]?.title, ideaData?.idea?.[0]?.accountName]);

    if (!licenseUrl) {
        return null;
    }

    return (
        <section id="licenseSection">
            <h3 id="licenseTitle">License</h3>
            <embed src={licenseUrl} id="licensePdfEmbed" />
        </section>
    );
}

// Main
export default function IdeaPage({ ideaData, pageTitle }) {
    const { randomIdeaId } = useAppContext();

    if (!ideaData) {
        return (
            <>
                <Head pageTitle="Idea not found" />
                <Nav randomId={randomIdeaId} />
                <main id="ideaMain">
                    <h1>Idea not found</h1>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Head pageTitle={pageTitle} />

            <Nav randomId={randomIdeaId} />

            <main id="ideaMain">
                <div id="ideaImageAsBackground" style={{ backgroundImage: `url(${ideaData['idea'][0]['ideaimage']})` }}>
                    <h1 id="title">{pageTitle}</h1>
                    <h2 id="author">
                        <a href={ideaData['idea'][0]['accountPublic'] == 1 ? `./account/${ideaData['idea'][0]['accountId']}` : ""} id="mainAuthorAccount">
                            {ideaData['idea'][0]['accountName']}
                        </a>
                    </h2>
                </div>

                <section id="ideaLikeSaveSection">
                    <ul>
                        <li id="savedIdea">
                            <img src="/images/saved.svg" alt="Save idea" id="savedIdeaImg" />
                            <div id="savedNumber">{ideaData['idealabels'][0]['saves']}</div>
                        </li>
                        <li id="likedIdea">
                            <img src="/images/liked.svg" alt="Like idea" id="likedIdeaImg" />
                            <div id="likedNumber">{ideaData['idealabels'][0]['likes']}</div>
                        </li>
                        <li id="dislikedIdea">
                            <img src="/images/disliked.svg" alt="Dislike idea" id="dislikedIdeaImg" />
                            <div id="dislikedNumber">{ideaData['idealabels'][0]['dislike']}</div>
                        </li>
                    </ul>
                    
                    <input type="button" id="followIdeaButton" value="Follow Idea" />
                    <input type="button" id="reportIdeaButton" value="Report Idea" />
                    <img src="/images/modify.svg" alt="Modify idea" id="modifyOldIdea" />
                </section>

                <p id="description">
                    {ideaData['idea'][0]['description']}
                </p>

                <PrintAdditionalInfo ideaData={ideaData} />

                <PrintDownloadLink ideaData={ideaData} />

                <LicenseSection ideaData={ideaData} />

                <PrintDevLogs ideaData={ideaData} />

                <section id="commentSection">
                    <h3 id="commentsTitle">Comments</h3>
                    <ul id="commentsList">
                        <PrintComments ideaData={ideaData} />
                    </ul>
                </section>
            </main>

            <Footer />
        </>
    )
}