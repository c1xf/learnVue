//@ts-check
export const nextTick = (function () {
    const callbacks = []
    let pending = false
    let timerFunc
  
    function nextTickHandler () {
      pending = false
      const copies = callbacks.slice(0)
      callbacks.length = 0
      for (let i = 0; i < copies.length; i++) {
        copies[i]()
      }
    }
  
    // the nextTick behavior leverages the microtask queue, which can be accessed
    // via either native Promise.then or MutationObserver.
    // MutationObserver has wider support, however it is seriously bugged in
    // UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
    // completely stops working after triggering a few times... so, if native
    // Promise is available, we will use it:
    /* istanbul ignore if */
    if (typeof Promise !== 'undefined') {
      var p = Promise.resolve()
      var logError = err => { console.error(err) }
      timerFunc = () => {
        p.then(nextTickHandler).catch(logError)
      }
    }else {
      // fallback to setTimeout
      /* istanbul ignore next */
      timerFunc = () => {
        setTimeout(nextTickHandler, 0)
      }
    }
  
    return function queueNextTick (cb, ctx) {
      let _resolve
      callbacks.push(() => {
        if (cb) cb.call(ctx)
        if (_resolve) _resolve(ctx)
      })
      if (!pending) {
        pending = true
        timerFunc()
      }
      if (!cb && typeof Promise !== 'undefined') {
        return new Promise(resolve => {
          _resolve = resolve
        })
      }
    }
  })()