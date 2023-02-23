import {client} from "../services/database.js";

const familyDatamapper = {
    async findByName(name){
        const sql = `SELECT * FROM family WHERE name = $1`;
        const values = [name];
        const result = await client.query(sql, values);
        return result.rows[0];
    },

    async findById(id){
        const sql = `
            SELECT id, name, (
                    SELECT json_agg(
                        json_build_object(
                            'id', id,
                            'title', title,
                            'description', description,
                            'gain', gain,
                            'isComplete', "isComplete",
                            'family_id', family_id
                        )
                    ) AS tasks
                    FROM task
                    WHERE family_id = $1
                ),
                (
                    SELECT json_agg(
                        json_build_object(
                            'id', id,
                            'title', title,
                            'price', price,
                            'isPurchase', "isPurchase",
                            'family_id', family_id
                        )
                    ) AS rewards
                    FROM reward
                    WHERE family_id = $1
                ),
                (
                    SELECT json_agg(
                        json_build_object(
                            'id', id,
                            'firstname', firstname,
                            'lastname', lastname,
                            'pseudo', pseudo,
                            'email', email,
                            'role_id', role_id,
                            'credit', credit
                        )
                    ) AS members
                    FROM "user"
                    JOIN user_has_family ON user_id = "user".id
                    WHERE family_id = $1
                )
            FROM FAMILY
            WHERE family.id = $1`
        const values = [id];
        const result = await client.query(sql, values);
        return result.rows[0];
    },

    async create(form){
        const sql = `
            INSERT INTO family (name)
            VALUES ($1)
            RETURNING *;`
        const values = [form.name];
        const result = await client.query(sql, values);
        return result.rows[0];
    },

    async createLink(userId, familyId){
        const sql = `
            INSERT INTO user_has_family (user_id, family_id)
            VALUES ($1, $2)
            RETURNING *;`
        const values = [userId, familyId];
        const result = await client.query(sql, values);
        return result.rows[0];
    },

    async update(form, id){
        const sql = `
            UPDATE family
            SET name = $1
            WHERE id = $2
            RETURNING *;`
        const values = [form.name, id];
        const result = await client.query(sql, values);
        return result.rows[0];
    }
}

export {familyDatamapper};