import React, { useContext, useEffect } from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Head from '../components/Head'
import { useAppContext } from '../contexts/CommonContext'
import { useRouter } from 'next/router'

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
function PrintAdditionalInfo(ideaData) {
    if (ideaData['info'].length != 0) {
        function PrintInfo(img, title, description) {
            return (
                <li className='imageInfoLi'>
                    <img src={img} alt='Image of additional info' className='imageInfo' />
                    <div>
                        <h3 className='titleImageInfo'>{title}</h3>
                    
                        <p className='imageInfoDescription'>
                            {description}
                        </p>
                    </div>
                </li>
            );
        }

        return (
            <ul id='imagesInfo'>
                {
                    ideaData['info'].forEach(ideaInfo => <PrintInfo img={ideaInfo['updtimage']} title={ideaInfo['title']} description={ideaInfo['description']} />)
                }
            </ul>
        );
    }
}

function PrintDownloadLink(ideaData) {
    if (ideaData['idea'][0]['downloadlink']) {
        const link = ideaData['idea'][0]['downloadlink'];

        return (
            <section id='downloadSection'>
                <h3 id='download'>External Link</h3>
                <a id='buttonlink' href={link}><button id='downloadButton'>{link}</button></a>
            </section>
        );
    }
}

async function GetFreeIdeasLicense(ideaData) {
    try {
        if (ideaData['idea'][0]['license']) {
            return ideaData['idea'][0]['license'];
        }
        else {
            const title = ideaData['idea'][0]['title'];
            const author = ideaData['idea'][0]['accountName'];

            const formData = new FormData();
            formData.append("title", title);
            formData.append("author", author);

            const response = await fetch("./api/getFreeIdeasLicense.php", {
                credentials: "include",
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (data['success']) {
                return data['data'];
            }
            else {
                throw new Error(ret['error']);
            }
        }
    } catch (error) {
        console.error(error);
        alert("An error occurred. Please try again.");
    }
}

function PrintDevLogs(ideaData) {
    if (ideaData['log'].length != 0) {
        function PrintLog(title, date, description) {
            return (
                <li class='log'>
                    <div class='logTitleAndData'>
                        <h4 class='logTitle'>{title}</h4>
                        <div class='data'>{date}</div>
                    </div>
                
                    <p class='logInfo'>
                        {description}
                    </p>
                </li>
            );
        }

        return (
            <section id='devLogsSection'>
                <h3 id='logsName'>Author's Log</h3>
                <ul id='logsList'>
                    {
                        ideaData['log'].forEach(ideaLog => <PrintLog title={ideaLog['title']} data={ideaLog['data']} description={ideaLog['description']} />)
                    }
                </ul>
            </section>
        );
    }
}

function PrintComments(ideaData) {
    if (ideaData['comment'].length != 0) {
        let indexOfRootComments = [];
        let indexOfSubComments = [];

        for (let i=0; i < ideaData['comment'].length; i++) { 
            if (ideaData['comment'][i]['superCommentid'] === null) {
                indexOfRootComments.push(i);
            }
            else {
                indexOfSubComments.push(i);
            }
        }

        for (let i=0; i < indexOfRootComments.length; i++) { // For each root comment
            j = indexOfRootComments[i];

            return printSubCommentRecursive(j, indexOfSubComments); // Print all the comments
        }

        return (
            <li className='comment' data-value='rootComment'><p className='replyComment'>Write a comment!</p></li>
        );
    }
    else {
        return (
            <li className='comment' data-value='rootComment'><p className='replyComment'>Write the first comment!</p></li>
        );
    }

    function printSubCommentRecursive(superi, indexOfSubComments) { // Get the current supercomment index and the list of index of subcomments
        let subCommentsToPrint = [];

        for (let i = 0; i < indexOfSubComments.length; i++) {
            if (ideaData['comment'][indexOfSubComments[i]]['superCommentid'] == ideaData['comment'][superi]['id']) { // If the subcomment is subcomment of the supercomment
                subCommentsToPrint.push(indexOfSubComments[i]); // Save the subcomment
                indexOfSubComments.pop(i); // Delete the subcomment
            }
        }

        return printComment(superi, subCommentsToPrint, indexOfSubComments); // Print the current comment and the 1^st level subcomments
    }

    function printComment(i, subComments, indexOfSubComments) {
        let authorid = ideaData['comment'][i]['authorid'];
        let accountLink = ideaData['comment'][i]['public']==1?"./accountVoid.php?account=$authorid":"";
        let accountimg = ideaData['comment'][i]['userimage']!=null?ideaData['comment'][i]['userimage']:"./images/user.svg";
        let accountUsername = ideaData['comment'][i]['username']==null?'Deleted':ideaData['comment'][i]['username'];
        let date = ideaData['comment'][i]['data'];
        let description = ideaData['comment'][i]['description'];
        let id = ideaData['comment'][i]['id'];

        function PrintDeleteButtonIfLoggedIn() {
            async function getSessionDataAccountFromDatabase() {
                try {
                    const res = await fetch(`${getApiUrl('getSessionData')}?data=account`, {
                        credentials: "include"
                    });
        
                    const data = await res.json();
        
                    return data && data.id ? data : null;
                } catch (error) {
                    console.error(error);
                    return null;
                }
            }
        
            async function getSessionDataAdminFromDatabase() {
                try {
                    const res = await fetch(`${getApiUrl('getSessionData')}?data=administrator`, {
                        credentials: "include"
                    });
        
                    const data = await res.json();
        
                    return data && data.id ? data : null;
                } catch (error) {
                    console.error(error);
                    return null;
                }
            }

            const sessionData = getSessionDataAccountFromDatabase();

            if ((sessionData && sessionData.id == authorid) || getSessionDataAdminFromDatabase()) {
                return (
                    <p className="deleteComment">Delete</p>
                );
            }
        }

        return (
            <li className='comment'>
                <div className='userInfo'>
                    <a href={accountLink} className='writerPage'>
                        <img src={accountimg} alt='Comment Author Account Image' className='writerImg' />
                        <div className='writerUserName'>{accountUsername}:</div>
                    </a>

                    <div className='dataWriter'>{date}</div>
                </div>
                <p className='commentText'>{description}</p>
                <p className='replyComment'>Reply</p>
                
                <PrintDeleteButtonIfLoggedIn />

                <ul className='underComments' data-id={id}>";
                
                {
                    subComments.foreach(subCommentIndex => printSubCommentRecursive(subCommentIndex, indexOfSubComments))
                }

                </ul>
            </li>
        );
    }
}

// Main
export default function IdeaPage({ideaData, pageTitle}) {
    const { randomIdeaId } = useAppContext();

    return (
        <>
            <Head pageTitle={pageTitle} />

            <Nav randomId={randomIdeaId} />

            <main id="ideaMain">
                <div id="ideaImageAsBackground" style={{backgroundImage: url(ideaData['idea'][0]['ideaimage'])}}>
                    <h1 id="title">{pageTitle}</h1>
                    <h2 id="author"><a href={ideaData['idea'][0]['accountPublic']==1?"./account/"+ideaData['idea'][0]['accountId']:""} id="mainAuthorAccount">{ideaData['idea'][0]['accountName']}</a></h2>
                </div>

                <section id="ideaLikeSaveSection">
                    <ul>
                        <li id="savedIdea"><img src="./images/saved.svg" alt="Save idea" id="savedIdeaImg" /><div id="savedNumber">{ideaData['idealabels'][0]['saves']}</div></li>
                        <li id="likedIdea"><img src="./images/liked.svg" alt="Like idea" id="likedIdeaImg" /><div id="likedNumber">{ideaData['idealabels'][0]['likes']}</div></li>
                        <li id="dislikedIdea"><img src="./images/disliked.svg" alt="Dislike idea" id="dislikedIdeaImg" /><div id="dislikedNumber">{ideaData['idealabels'][0]['dislike']}</div></li>
                    </ul>
                    
                    <input type="button" id="followIdeaButton" value="Follow Idea" />
                    <input type="button" id="reportIdeaButton" value="Report Idea" />
                    <img src="./images/modify.svg" alt="Modify idea" id="modifyOldIdea" />
                </section>

                <p id="description">
                    {ideaData['idea'][0]['description']}
                </p>

                <PrintAdditionalInfo ideaData={ideaData}/>

                <PrintDownloadLink ideaData={ideaData}/>

                <section id="licenseSection">
                    <h3 id="licenseTitle">License</h3>
                    <embed src={<GetFreeIdeasLicense ideaData={ideaData} />} id="licensePdfEmbed" />
                </section>

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