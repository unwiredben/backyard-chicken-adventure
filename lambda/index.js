// Backyard Chicken Adventure
// by Ben Combee and Elias Combee
// July 4, 2019

const Alexa = require('ask-sdk-core');

function lookLocationsText() {
    return "You can look in the tree, the neighbor's backyard, or the spooky abandoned lot next door.";
}

function foundAllChickens(attr) {
    return attr.chickyFound && attr.bowieFound && attr.magnoliaFound;
}

function winTheGame(handlerInput, speechText) {
    speechText += " You've found all the chickens! They're now safe back in their coop.  Thank you for playing, and goodbye!";
    return handlerInput.responseBuilder
        .speak(speechText)
        .getResponse();
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {

        var sessionAttributes = {
            chickyFound: false,
            bowieFound: false,
            magnoliaFound: false
        };
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

        const speechText = "Welcome to Backyard Chicken Adventure. You are awakened from a nap by the sound of rustling chickens. "
         + '<audio src="soundbank://soundlibrary/nature/amzn_sfx_earthquake_rumble_02"/> '
         + "You run to your backyard and see a hawk fly off, then you notice that your three chickens are all missing from their coop. "
         + "You need to find them to keep them safe. "
         + lookLocationsText();
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(lookLocationsText())
            .getResponse();
    }
};
const CheckTreeIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'CheckTreeIntent';
    },
    handle(handlerInput) {
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        let speechText = sessionAttributes.chickyFound ?
            "You already looked in the tree. That's where you found Chicky. " :
            "In the tree, you found your little Chicky.  "
            + '<audio src="soundbank://soundlibrary/animals/amzn_sfx_bird_chickadee_chirp_1x_01"/> '
            + "She seems a bit frazzled, but otherwise unhurt. ";
        sessionAttributes.chickyFound = true;

        if (foundAllChickens(sessionAttributes)) {
            return winTheGame(handlerInput, speechText);
        }

        speechText += lookLocationsText();

        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(lookLocationsText())
            .getResponse();
    }
};

const CheckNeighborsBackyardIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'CheckNeighborsBackyardIntent';
    },
    handle(handlerInput) {
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        let speechText = sessionAttributes.bowieFound ?
            "You already looked in the neighbor's backyard. That's where you found David Bowie. " :
            "You peek through the fence and see your rooster, a slight bantam named David Bowie. "
            + '<audio src="soundbank://soundlibrary/animals/amzn_sfx_rooster_crow_01"/>'
            + "He's running around frantically, but seems OK. ";
        sessionAttributes.bowieFound = true;

        if (foundAllChickens(sessionAttributes)) {
            return winTheGame(handlerInput, speechText);
        }

        speechText += lookLocationsText();

        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(lookLocationsText())
            .getResponse();
    }
};

const CheckAbandonedLotIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'CheckAbandonedLotIntent';
    },
    handle(handlerInput) {
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        let speechText = sessionAttributes.magnoliaFound ?
            "You already looked in the spooky lot. That's where you found Magnolia. " :
            "You hear clucking coming from an old well left on the property.  "
            + '<audio src="soundbank://soundlibrary/animals/amzn_sfx_chicken_cluck_01"/>'
            + "Fortunately, there's a bucket with a rope, and you are "
            + "able to use that to lift your hen, Magnolia, back up to the surface. She's wet, but otherwise fine. ";

        sessionAttributes.magnoliaFound = true;

        if (foundAllChickens(sessionAttributes)) {
            return winTheGame(handlerInput, speechText);
        }

        speechText += lookLocationsText();

        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(lookLocationsText())
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = 'This is a game about rescuing chickens. You can say the name of a place nearby to check.';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechText = 'Thanks for playing, goodbye!';
        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = handlerInput.requestEnvelope.request.intent.name;
        const speechText = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speechText)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.message}`);
        const speechText = `Sorry, I couldn't understand what you said. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

// This handler acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        CheckTreeIntentHandler,
        CheckNeighborsBackyardIntentHandler,
        CheckAbandonedLotIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler) // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    .addErrorHandlers(
        ErrorHandler)
    .lambda();
