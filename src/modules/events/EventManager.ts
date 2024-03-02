import { Events, EventHandler, PopoverEvents } from "./types";

type $Events = Events | PopoverEvents;

const { log } = console;

class EventManager {
  private eventHandlers: Map<$Events, EventHandler<any>[]>;

  constructor() {
    this.eventHandlers = new Map();
  }

  on<T>(eventName: $Events, handler: EventHandler<T>) {
    const handlers = this.eventHandlers.get(eventName) || [];
    handlers.push(handler);
    this.eventHandlers.set(eventName, handlers);
    document.addEventListener(eventName, handler as EventListener);
  }

  off<T>(eventName: $Events, handler: EventHandler<T>) {
    const handlers = this.eventHandlers.get(eventName);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    }
    document.removeEventListener(eventName, handler as EventListener);
  }

  emit<T>(eventName: $Events, detail?: T) {
    const event = new CustomEvent<T>(eventName, { detail });
    document.dispatchEvent(event);
  }
}

export const eventManager = new EventManager();
