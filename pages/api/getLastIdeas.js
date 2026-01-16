import { query } from '../../lib/db_connection';

export default async function handler(req, res) {
    try {
        // Get the ideas
        const ideas = await query(
            'SELECT accounts.username, ideas.id, ideas.title, ideas.ideaimage FROM ideas JOIN accounts ON ideas.authorid=accounts.id ORDER BY ideas.id DESC LIMIT 22;',
            []
        );

        if (ideas.length === 0) {
            return res.status(401).json({ success: false, error: 'cannot_get_last_ideas' });
        }

        return res.status(200).json({ success: true, data: ideas });
    } catch (error) {
        console.error('Error: ', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}