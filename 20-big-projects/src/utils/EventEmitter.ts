type Callback = (...args: any[]) => any;

interface CallbackMap {
  [key: string]: {
    [key: string]: Callback[];
  };
}

interface ResolvedName {
  original: string;
  value: string;
  namespace: string;
}

export default class EventEmitter {
  private callbacks: CallbackMap;

  constructor() {
    this.callbacks = {};
    this.callbacks.base = {};
  }

  on(_names: string, callback: Callback): this | false {
    // Errors
    if (typeof _names === 'undefined' || _names === '') {
      console.warn('wrong names');
      return false;
    }

    if (typeof callback === 'undefined') {
      console.warn('wrong callback');
      return false;
    }

    // Resolve names
    const names = this.resolveNames(_names);

    // Each name
    names.forEach((_name) => {
      // Resolve name
      const name = this.resolveName(_name);

      // Create namespace if not exist
      if (!(this.callbacks[name.namespace] instanceof Object)) {
        this.callbacks[name.namespace] = {};
      }

      // Create callback if not exist
      if (!(this.callbacks[name.namespace][name.value] instanceof Array)) {
        this.callbacks[name.namespace][name.value] = [];
      }

      // Add callback
      this.callbacks[name.namespace][name.value].push(callback);
    });

    return this;
  }

  off(_names: string): this | false {
    // Errors
    if (typeof _names === 'undefined' || _names === '') {
      console.warn('wrong name');
      return false;
    }

    // Resolve names
    const names = this.resolveNames(_names);

    // Each name
    names.forEach((_name) => {
      // Resolve name
      const name = this.resolveName(_name);

      // Remove namespace
      if (name.namespace !== 'base' && name.value === '') {
        delete this.callbacks[name.namespace];
      } else {
        // Default
        if (name.namespace === 'base') {
          // Try to remove from each namespace
          for (const namespace in this.callbacks) {
            if (
              this.callbacks[namespace] instanceof Object &&
              this.callbacks[namespace][name.value] instanceof Array
            ) {
              delete this.callbacks[namespace][name.value];

              // Remove namespace if empty
              if (Object.keys(this.callbacks[namespace]).length === 0) {
                delete this.callbacks[namespace];
              }
            }
          }
        }

        // Specified namespace
        else if (
          this.callbacks[name.namespace] instanceof Object &&
          this.callbacks[name.namespace][name.value] instanceof Array
        ) {
          delete this.callbacks[name.namespace][name.value];

          // Remove namespace if empty
          if (Object.keys(this.callbacks[name.namespace]).length === 0) {
            delete this.callbacks[name.namespace];
          }
        }
      }
    });

    return this;
  }

  trigger(_name: string, _args: any[] = []): any | false {
    // Errors
    if (typeof _name === 'undefined' || _name === '') {
      console.warn('wrong name');
      return false;
    }

    let finalResult: any = undefined;
    let result: any = undefined;

    // Resolve names (should only have one event)
    const names = this.resolveNames(_name);
    const name = this.resolveName(names[0]);

    // Default namespace
    if (name.namespace === 'base') {
      // Try to find callback in each namespace
      for (const namespace in this.callbacks) {
        if (
          this.callbacks[namespace] instanceof Object &&
          this.callbacks[namespace][name.value] instanceof Array
        ) {
          this.callbacks[namespace][name.value].forEach((callback) => {
            result = callback.apply(this, _args);
            if (typeof finalResult === 'undefined') {
              finalResult = result;
            }
          });
        }
      }
    }

    // Specified namespace
    else if (this.callbacks[name.namespace] instanceof Object) {
      if (name.value === '') {
        console.warn('wrong name');
        return this;
      }

      this.callbacks[name.namespace][name.value].forEach((callback) => {
        result = callback.apply(this, _args);
        if (typeof finalResult === 'undefined') finalResult = result;
      });
    }

    return finalResult;
  }

  private resolveNames(_names: string): string[] {
    let names = _names.replace(/[^a-zA-Z0-9 ,/.]/g, '');
    names = names.replace(/[,/]+/g, ' ');
    return names.split(' ');
  }

  private resolveName(name: string): ResolvedName {
    const parts = name.split('.');
    return {
      original: name,
      value: parts[0],
      namespace: parts.length > 1 && parts[1] !== '' ? parts[1] : 'base',
    };
  }
}
