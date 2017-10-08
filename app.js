var util = require('util');
var builder = require('botbuilder');
var restify = require('restify');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot and listen to messages
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
server.post('/api/messages', connector.listen());

// create the bot
var bot = new builder.UniversalBot(connector);

//Send welcome when conversation with bot is started, by initiating the root dialog
bot.on('conversationUpdate', function (message) {
    if (message.membersAdded) {
        message.membersAdded.forEach(function (identity) {
            if (identity.id === message.address.bot.id) {
                bot.beginDialog(message.address, '/');
            }
        });
    }
});


bot.dialog('/',[
    function(session){
        
        session.say("","Hello! Mr.Tadashi, its time for your afternoon medication. Are you experiencing any symptoms today?")
        builder.Prompts.choice(session,"Hello! Mr.Tadashi, its time for your afternoon medication. Are you experiencing any symptoms today?",['Yes',"No"],{listStyle: builder.ListStyle.button})
    },
    function(session,results,next){
        if(results.response.entity == 'No'){
            var msg = new builder.Message(session)
       .addAttachment({
           contentType: "application/vnd.microsoft.card.adaptive",
           content: {
	"$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
	"type": "AdaptiveCard",
	"version": "1.0",
	"body": [
		
		{
			"type": "Container",
			"items": [
				{
					"type": "TextBlock",
					"text": "Glad to hear that. Please take the following medication.",
					"wrap": true
				},
				{
					"type": "FactSet",
					"facts": [
						{
							"title": "Valium:",
							"value": "Two Tablets, 5mg each"
						},
						{
							"title": "Prozac",
							"value": "One Tablet, 2mg each"
						}
						
						
					]
				}
			]
		}
	]
	
}
    })
       session.endDialog(msg)
      
        }
    else {
        
        builder.Prompts.text(session,'What kind of symptoms are you experiencing?')
        
    }
    },
    function(session,results,next){
        if(results.response.indexOf('bloated')>-1){
            session.dialogData.symptom = 'Bloating'
            builder.Prompts.choice(session,"How would you rate your symptom?",['Mild','Moderate','Severe'],{listStyle: builder.ListStyle.button})
        }
    },
    function(session,results){
        if(results.response.entity == 'Mild'){
        var msg = new builder.Message(session)
       .addAttachment({
           contentType: "application/vnd.microsoft.card.adaptive",
           content: {
	"$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
	"type": "AdaptiveCard",
	"version": "1.0",
	"body": [
		
		{
			"type": "Container",
			"items": [
				{
					"type": "TextBlock",
					"text": "Mild bloating is one the side effect of your medication. You have nothing to worry about. If it is interfering with your daily activities, please take the following recommended dose of Pepto-bismol along with your regular medication.",
					"wrap": true
				},
				{
					"type": "FactSet",
					"facts": [
						{
							"title": "Valium:",
							"value": "Two Tablets, 5mg each"
						},
						{
							"title": "Prozac",
							"value": "One Tablet, 2mg each"
						},
						{
							"title": "Peptobismol:",
							"value": "1 dose (30 mL or 2 TBSP)- Optional"
						}
						
					]
				}
			]
		}
	]
        }
        
    })
    session.endDialog(msg)
}
}
])
bot.dialog('DietRestriction', [
    function(session){
    var card = new builder.HeroCard(session)
        .title('')
        .subtitle('')
        .text('According to your current treatment you are on a low fiber diet. So, it is better if you avoid high fiber foods like raspberry. Instead you can consume low total fiber/good soluble foods like bannana,mashed potato etc. ')
        
        .buttons([
            builder.CardAction.openUrl(session, 'http://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/low-fiber-diet/art-20048511', 'Learn more')
        ]);
    var msg = new builder.Message(session).addAttachment(card);
    session.sendTyping();
    session.endDialog(msg)
    session.endDialog('According to your current treatment you are on a low fiber diet. So, it is better if you avoid high fiber foods like raspberry. Instead you can consume low total fiber/good soluble foods like bannana,mashed potato etc. ')
    }
])
// Once triggered, will clear the dialog stack and pushes
// the 'orderDinner' dialog onto the bottom of stack.
.triggerAction({
    matches: /can.*/i
});
bot.dialog('AccuCheck', [
    function(session){
    var card = new builder.VideoCard(session)
        .title('How To Use Your Accu-Chek')
        .subtitle('by Accu-Chek-US')
        .text('')
        .image(builder.CardImage.create(session, 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Big_buck_bunny_poster_big.jpg/220px-Big_buck_bunny_poster_big.jpg'))
        .media([
            { url: 'https://www.youtube.com/watch?v=RcUy7rLYK3o' }
        ])
        .buttons([
            builder.CardAction.openUrl(session, 'https://www.accu-chek.com/', 'Learn More')
        ]);   
    
        var msg = new builder.Message(session).addAttachment(card);
        session.sendTyping();
        session.endDialog(msg)
    }
])
// Once triggered, will clear the dialog stack and pushes
// the 'orderDinner' dialog onto the bottom of stack.
.triggerAction({
    matches: /how.*/i
});

bot.dialog('StopMedication', [
    function(session){
    var card = new builder.HeroCard(session)
        .title('')
        .subtitle('')
        .text('Nose bleed is not an expected side effect, please contact your doctor immediately.')
        
        .buttons([
            builder.CardAction.openUrl(session, 'http://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/low-fiber-diet/art-20048511', 'Learn more')
        ]);
    var msg = new builder.Message(session).addAttachment(card);
    session.sendTyping();
    session.endDialog(msg)
    session.endDialog('According to your current treatment you are on a low fiber diet. So, it is better if you avoid high fiber foods like raspberry. Instead you can consume low total fiber/good soluble foods like bannana,mashed potato etc. ')
    }
])
// Once triggered, will clear the dialog stack and pushes
// the 'orderDinner' dialog onto the bottom of stack.
.triggerAction({
    matches: /I .*/i
});