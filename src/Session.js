import React from 'react';

export default class Session
{
    constructor(id,user,date,puzzle)
    {
        this.id_session = id;
        this.id_user = user;
        this.date_session = date;
        this.puzzle_type = puzzle;
    }
}
