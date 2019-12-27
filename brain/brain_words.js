var Util = require('./util.js');

module.exports = 
{
    async add_Words(table, new_words)
    {
        try 
        {
            for (var i = 0; i < new_words.length; i++)
            {
                await table.findOne({ where: { word: new_words[i] } })
                    .then(result => 
                    {
                        if (!result) 
                        {
                            table.create({ word: new_words[i] });
                        }
                        else
                        {
                            result.increment('frequency');
                        }
                    });
            }
        }
        catch (error) 
        {
            console.error(error);
        }
    },
    async remove_Word(table, message, existing_word)
    {
        await table.destroy({ where: { word: existing_word } })
            .then(message.channel.send(`"${existing_word}" has been removed from the database.`));
    },
    async remove_Words(table, message)
    {
        await table.destroy({ where: {} })
            .then(message.channel.send(`All words have been removed from the database.`));
    },
    async get_Word(table, message, existing_word)
    {
        var results = await table.findAll({ where: { word: existing_word } })
        if (results != null &&
            results != '')
        {
            for (var i = 0; i < results.length; i++)
            {
                message.channel.send(`"${results[i].word}": ${results[i].frequency}\n`);
            }
        }
        else
        {
            message.channel.send(`Could not find "${existing_word}" in the database.`);
        }
    },
    async get_Words(table, message)
    {
        var wordList = await table.findAll({ attributes: ['word', 'frequency'] });
        if (wordList)
        {
            for (var i = 0; i < wordList.length; i++)
            {
                message.channel.send(`"${wordList[i].word}": ${wordList[i].frequency}\n`);
            }
        }
        else
        {
            return message.channel.send('No words found in the database.');
        }
    },
    async get_WordCount(table, message, existing_word)
    {
        var result = await table.findOne({ where: { word: existing_word } })
        if (result != null &&
            result != '')
        {
            return result.frequency;
        }
        
        return 0;
    },
    async get_Word_Max(table, words)
    {
        try
        {
            return result = await table.findAll({ where: { word: words } })
                .then(results => 
                {
                    if (results != null &&
                        results != '')
                    {
                        var max = results[0];
                        for (var i = 0; i < results.length; i++)
                        {
                            if (results[i].frequency >= max.frequency)
                            {
                                max = results[i];
                            }
                        }

                        return max.word;
                    }
                });
        }
        catch (error)
        {
            console.error(error);
        }

        return null;
    },
    async get_Word_Min(table, message, words)
    {
        try
        {
            return result = await table.findAll({ where: { word: words } })
                .then(results => 
                {
                    if (results != null &&
                        results != '')
                    {
                        var min = null;
                        for (var i = 0; i < results.length; i++)
                        {
                            min = results[i];
                            break;
                        }
                        
                        if (min != null)
                        {
                            //Get word with minimum frequency
                            for (var i = 0; i < results.length; i++)
                            {
                                if (results[i].word)
                                {
                                    if (results[i].frequency <= min.frequency)
                                    {
                                        min = results[i];
                                    }
                                }
                            }
                            
                            return min.word;
                        }
                    }
                });
        }
        catch (error)
        {
            console.error(error);
        }

        return null;
    },
    async decrease_WordCount(table, message, existing_word)
    {
        var found_word = await table.findOne({ where: { word: existing_word } })
        if (found_word)
        {
            found_word.decrement('frequency');
            message.channel.send(`${found_word.word}: ${found_word.frequency - 1}`);
        }
        else
        {
            message.channel.send(`Could not find "${existing_word}" in the database.`);
        }
    },
    async increase_WordCount(table, message, existing_word)
    {
        var found_word = await table.findOne({ where: { word: existing_word } })
        if (found_word)
        {
            found_word.increment('frequency');
            message.channel.send(`${found_word.word}: ${found_word.frequency + 1}`);
        }
        else
        {
            message.channel.send(`Could not find "${existing_word}" in the database.`);
        }
    }
}