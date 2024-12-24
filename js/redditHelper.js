'use strict';
class RedditHelper {

    static async getComments(subName, postId) {
        try {
            const url = `https://www.reddit.com/svc/shreddit/comments/r/${subName}/${postId}?render-mode=partial&sort=new&inline-refresh=true`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const commentElementList = doc.querySelectorAll('shreddit-comment');
            const commentIdList = Array.from(commentElementList).map(c => c.getAttribute('thingid'));
            return commentIdList;
        } catch (error) {
            console.error(error.message);
        }
    }
}