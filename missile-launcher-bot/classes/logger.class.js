export class FrostburnLogger {
    static logReadyState() {
        console.log('🤖 Frostburn Missile Launcher - READY!');
    }

    static logVotedForStart(messageAuthor) {
        console.log('✅ Voted for start: ', messageAuthor);
    }

    static logHaltTrigger(initiator) {
        console.log('😴 Server halt requested by ', initiator)
    }
}