const PlayerCharacter = require('../../database/models/PlayerCharacter');
const NonPlayableCharacter = require('../../database/models/NonPlayableCharacter');
const Quest = require('../../database/models/Quest');

exports.dashboardPage = async (req, res) => {
    const bot = require('../../index');
    let characters = await getAliveCharacters();

    res.render('dashboardPage', { isDashboardPage: true, bot: bot, headerTitle: 'Chthulu', guildName: '', characters: characters });
}

exports.guildDashboardPage = async (req, res) => {
    const bot = require('../../index');
    const guildId = req.params.id;
    const guild = bot.guilds.cache.get(guildId);
    let characters = await getAliveCharacters(guildId);

    res.render('dashboardPage', { isGuildDashboardPage: true, bot: bot, headerTitle: '', guild: guild, selectedGuildId: guildId, guildName: guild.name, characters: characters });
}

//CONSTRUCTION PAGE
exports.constructionDashboardPage = async (req, res) => {
    const bot = require('../../index');
    const guildId = req.params.id;
    const guild = bot.guilds.cache.get(guildId);


    res.render('constructionPage', { isGuildDashboardPage: true, bot: bot, headerTitle: '', guild: guild, selectedGuildId: guildId, guildName: guild.name });
}

//CHARACTERS PAGE
exports.guildInformationalCharactersDashboardPage = async (req, res) => {
    const bot = require('../../index');
    const guildId = req.params.id;
    const guild = bot.guilds.cache.get(guildId);

    let characters = await getAliveCharacters(guildId);

    res.render('charactersPage', { isGuildDashboardPage: true, bot: bot, headerTitle: `Characters`, guild: guild, selectedGuildId: guildId, guildName: guild.name, characters: characters.reverse() });
}

async function getAliveCharacters(guildId = null) {
    if (guildId === null) {
        return await PlayerCharacter.findAll({ where: { alive: 1 } })
    } else {
        return await PlayerCharacter.findAll({ where: { alive: 1, server_id: guildId } })
    }
}

//NPC'S PAGE
exports.guildInformationalNonPlayableCharactersDashboardPage = async (req, res) => {
    const bot = require('../../index');
    const guildId = req.params.id;
    const guild = bot.guilds.cache.get(guildId);

    let npcs = await getNonPlayableCharacters(guildId);
    res.render('nonPlayableCharactersPage', { isGuildDashboardPage: true, bot: bot, headerTitle: `NPC's`, guild: guild, selectedGuildId: guildId, guildName: guild.name, npcs: npcs.reverse() });
}

async function getNonPlayableCharacters(guildId = null) {
    if (guildId === null) {
        return await NonPlayableCharacter.findAll({ where: { status: "VISIBLE" } })
    } else {
        return await NonPlayableCharacter.findAll({ where: { status: "VISIBLE", server_id: guildId } })
    }
}

//QUESTS PAGE
exports.guildInformationalQuestsDashboardPage = async (req, res) => {
    const bot = require('../../index');
    const guildId = req.params.id;
    const guild = bot.guilds.cache.get(guildId);

    let completedQuests = await getQuests(guildId, "COMPLETED");
    let uncompletedQuests = await getQuests(guildId, "OPEN");

    res.render('questsPage', { isGuildDashboardPage: true, bot: bot, headerTitle: `Quests`, guild: guild, selectedGuildId: guildId, guildName: guild.name, uncompletedQuests: uncompletedQuests.reverse(), completedQuests: completedQuests.reverse() });
}

async function getQuests(guildId = null, status) {
    if (guildId === null) {
        let quests = await Quest.findAll();
        quests.sort(function (a, b) {
            a = a.get('quest_importance_value')
            b = b.get('quest_importance_value')
            return a - b;
        })
        return quests;
    } else {
        let quests = await Quest.findAll({ where: { quest_status: status, server_id: guildId } });
        quests.sort(function (a, b) {
            a = a.get('quest_importance_value')
            b = b.get('quest_importance_value')
            return a - b;
        })
        return quests;
    }
}

//CREATE QUEST POST
exports.createQuestPost = async (req, res) => {
    let priority_value = Math.floor(req.body.priority);
    if (priority_value < 1) {
        priority_value = 1;
    } else if (priority_value > 5) {
        priority_value = 5;
    }

    let importance = getImportanceText(priority_value);
    let title = req.body.title?.substring(0, 30);
    let description = req.body.description?.substring(0, 400);

    await Quest.create({
        quest_giver: 'WEBSITE',
        quest_description: description,
        quest_name: title,
        quest_importance_value: priority_value,
        quest_importance: importance,
        quest_status: 'OPEN',
        server_id: req.params.id
    }).then(() => {
        res.sendStatus(201)
    })


}

function getImportanceText(priority_value) {
    switch (priority_value) {
        case 5:
            return 'Very high'
        case 4:
            return 'High'
        case 3:
            return 'Normal'
        case 2:
            return 'Low'
        case 1:
            return 'Very low'
    }
}

exports.deleteQuestRequest = async (req, res) => {
    console.log()
    let quest_id = req.body?.quest_id;
    let server_id = req.params?.id || '0';
    if (quest_id) {
        await Quest.update(
            { quest_status: 'DELETED' },
            {
                where: { quest_id: quest_id, server_id: server_id }
            }).then(async () => {
                res.sendStatus(201)
            });
    }
}