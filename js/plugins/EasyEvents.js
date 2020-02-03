/*
 *
 *
 * @plugindesc lets you hook into events via $ev.on, $ev.before or $ev.after instead of extending them
 * @author SUCC
 * 
 * @help
 * 
 * 
 */

//-----------------------------------------------------------------------------
// classes
//-----------------------------------------------------------------------------
class EasyEventsHandler {
    constructor() {
        this.events = {}
    }
    init() {
        this.rewrite(Game_Temp)
        this.rewrite(Game_System)
        this.rewrite(Game_Screen)
        this.rewrite(Game_Timer)
        this.rewrite(Game_Message)
        this.rewrite(Game_Switches)
        this.rewrite(Game_Variables)
        this.rewrite(Game_SelfSwitches)
        this.rewrite(Game_Actors)
        this.rewrite(Game_Party)
        this.rewrite(Game_Troop)
        this.rewrite(Game_Map)
        this.rewrite(Game_Player)
    }
    rewrite(eventClass) {
        let eventClassBackup = eventClass;
        let scope = eventClass.name.split('_')[1]
        for (let prop in eventClass.prototype) {
            if (prop.substring(0,2) == 'on') {
                if (prop.slice(2, 7) == 'After')
                {
                    this.after(prop.slice(7, prop.length), eventClassBackup.prototype[prop], scope)
                    eventClass.prototype[prop] = function(...params) {
                        $ev.emitType('after', prop.slice(7, prop.length), this, scope,params)
                    }
                }
                else if (prop.slice(2, 8) == 'Before')
                {
                    this.before(prop.slice(8, prop.length), eventClassBackup.prototype[prop], scope)
                    eventClass.prototype[prop] = function (...params) {
                        $ev.emitType('before', prop.slice(8, prop.length), this, scope, params)
                    }
                }
                else {
                    this.on(prop.slice(2, prop.length), eventClassBackup.prototype[prop], scope)
                    if (!eventClass.prototype['onAfter'+prop.slice(2, prop.length)])
                    {
                        if (!eventClass.prototype['onBefore' + prop.slice(2, prop.length)])
                        {
                            eventClass.prototype[prop] = function (...params) {
                                $ev.emitType('before', prop.slice(2, prop.length), this, scope, params)
                                $ev.emitType('on', prop.slice(2, prop.length), this, scope, params)
                                $ev.emitType('after', prop.slice(2, prop.length), this, scope, params)
                            }
                        } else {
                            eventClass.prototype[prop] = function (...params) {
                                $ev.emitType('on', prop.slice(2, prop.length), this, scope, params)
                                $ev.emitType('after', prop.slice(2, prop.length), this, scope, params)
                            }
                        }
                    }
                    else if (!eventClass.prototype['onBefore' + prop.slice(2, prop.length)])
                    {
                        eventClass.prototype[prop] = function (...params) {
                            $ev.emitType('before', prop.slice(2, prop.length), this, scope, params)
                            $ev.emitType('on', prop.slice(2, prop.length), this, scope, params)
                        }
                    } else {
                        eventClass.prototype[prop] = function (...params) {
                            $ev.emitType('on', prop.slice(2, prop.length), this, scope, params)
                        }
                    }
                }
            }
        }
    }
    emitType(type,eventName,context, scope, ...params) {
        if(scope)
        {
            if (this.events[eventName] && this.events[eventName][scope] && this.events[eventName][scope][type]) {
                for (let event of this.events[eventName][scope][type]) {
                    event && event.call(context, ...params)
                }
            }
        }
        else if (this.events[eventName] && this.events[eventName][type] && scope === 'All')
        {
            for (let event of this.events[eventName][type]) {
                event && event.call(context, ...params)
            }
            for (let scope in this.events[eventName]) {
                if (typeof this.events[eventName][scope] === 'Object')
                {
                    for (let event of this.events[eventName][scope][type]) {
                        event && event.call(context, ...params)
                    }
                } 
            }
        } else if (this.events[eventName] && this.events[eventName][type]){
            for (let event of this.events[eventName][type]) {
                event && event.call(context, ...params)
            }
        }
    }
    emit(eventName, context, scope, ...params) {
        this.emitType('before', eventName, context, scope,...params)
        this.emitType('on', eventName, context, scope, ...params)
        this.emitType('after', eventName, context, scope, ...params)
    }
    on(eventName, callback, scope) {
        this.registerEventHook('on', eventName, callback, scope)
    }
    before(eventName, callback, scope) {
        this.registerEventHook('before', eventName, callback, scope)
    }
    after(eventName, callback, scope) {
        this.registerEventHook('after', eventName, callback, scope)
    }
    registerEventHook(type, eventName, callback, scope) {
        this.events[eventName] = this.events[eventName] || {}
        if(scope)
        {
            this.events[eventName][scope] = this.events[eventName][scope] || {};
            this.events[eventName][scope][type] = this.events[eventName][scope][type] || []
            this.events[eventName][scope][type].push(callback)
        }
        else {
            this.events[eventName][type] = this.events[eventName][type] || []
            this.events[eventName][type].push(callback)
        }
    }
}

//-----------------------------------------------------------------------------
// init
//-----------------------------------------------------------------------------

window.$ev = new EasyEventsHandler();
window.$ev.init();
