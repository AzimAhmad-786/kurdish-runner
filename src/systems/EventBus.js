/**
 * EventBus - Global event communication system
 * 
 * This allows different scenes and systems to communicate without tight coupling.
 * Instead of scenes directly calling each other's methods, they emit and listen to events.
 */

class EventBus {
    constructor() {
        this.listeners = {};
    }

    /**
     * Emit an event
     * @param {string} eventName - Name of the event
     * @param {*} data - Data to pass with the event
     */
    emit(eventName, data) {
        if (!this.listeners[eventName]) return;
        
        // Create a copy to avoid issues if listeners are removed during emit
        const listeners = [...this.listeners[eventName]];
        
        listeners.forEach(listener => {
            listener.callback.call(listener.context, data);
            
            // Remove once listeners after calling
            if (listener.once) {
                this.off(eventName, listener.callback, listener.context);
            }
        });
    }

    /**
     * Listen for an event
     * @param {string} eventName - Name of the event
     * @param {Function} callback - Function to call when event is emitted
     * @param {*} context - Context for the callback
     */
    on(eventName, callback, context) {
        if (!this.listeners[eventName]) {
            this.listeners[eventName] = [];
        }
        
        this.listeners[eventName].push({
            callback: callback,
            context: context,
            once: false
        });
    }

    /**
     * Listen for an event once
     * @param {string} eventName - Name of the event
     * @param {Function} callback - Function to call when event is emitted
     * @param {*} context - Context for the callback
     */
    once(eventName, callback, context) {
        if (!this.listeners[eventName]) {
            this.listeners[eventName] = [];
        }
        
        this.listeners[eventName].push({
            callback: callback,
            context: context,
            once: true
        });
    }

    /**
     * Remove an event listener
     * @param {string} eventName - Name of the event
     * @param {Function} callback - The callback to remove
     * @param {*} context - Context for the callback
     */
    off(eventName, callback, context) {
        if (!this.listeners[eventName]) return;
        
        this.listeners[eventName] = this.listeners[eventName].filter(listener => {
            return listener.callback !== callback || listener.context !== context;
        });
    }

    /**
     * Remove all listeners for an event
     * @param {string} eventName - Name of the event
     */
    removeAllListeners(eventName) {
        if (eventName) {
            delete this.listeners[eventName];
        } else {
            this.listeners = {};
        }
    }
}

// Create a global instance
window.EventBus = new EventBus();

// Define event names as constants for easy reference
window.GameEvents = {
    ITEM_COLLECTED: 'itemCollected',
    OBSTACLE_HIT: 'obstacleHit',
    LEVEL_COMPLETE: 'levelComplete',
    UPDATE_COUNTER: 'updateCounter',
    COUNTER_COMPLETE: 'counterComplete',
    GAME_START: 'gameStart',
    GAME_PAUSE: 'gamePause',
    GAME_RESUME: 'gameResume'
};

