/* @flow */
//@ts-check
import {
    queueWatcher
} from './scheduler'
import {
    pushTarget,
    popTarget
} from './dep'

let uid = 0

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
export default class Watcher {
    vm;
    expression;
    cb;
    id;
    deps;
    newDeps;
    depIds;
    newDepIds;
    getter;
    value;

    constructor(
        vm,
        expOrFn,
        cb
    ) {
        this.vm = vm
        vm._watchers.push(this)

        this.cb = cb
        this.id = ++uid // uid for batching
        this.active = true
        this.deps = []
        this.newDeps = []
        this.depIds = new Set()
        this.newDepIds = new Set()

        this.getter = expOrFn
        this.value = this.get()
    }

    /**
     * Evaluate the getter, and re-collect dependencies.
     */
    get() {
        pushTarget(this)
        let value
        const vm = this.vm
        value = this.getter.call(vm, vm)

        popTarget()
        this.cleanupDeps()
        return value
    }

    /**
     * Add a dependency to this directive.
     */
    addDep(dep) {
        const id = dep.id
        if (!this.newDepIds.has(id)) {
            this.newDepIds.add(id)
            this.newDeps.push(dep)
            if (!this.depIds.has(id)) {
                dep.addSub(this)
            }
        }
    }

    /**
     * Clean up for dependency collection.
     */
    cleanupDeps() {
        let i = this.deps.length
        while (i--) {
            const dep = this.deps[i]
            if (!this.newDepIds.has(dep.id)) {
                dep.removeSub(this)
            }
        }
        let tmp = this.depIds
        this.depIds = this.newDepIds
        this.newDepIds = tmp
        this.newDepIds.clear()
        tmp = this.deps
        this.deps = this.newDeps
        this.newDeps = tmp
        this.newDeps.length = 0
    }

    /**
     * Subscriber interface.
     * Will be called when a dependency changes.
     */
    update() {
        /* istanbul ignore else */
        queueWatcher(this)
    }

    /**
     * Scheduler job interface.
     * Will be called by the scheduler.
     */
    run() {
        if (this.active) {
            const value = this.get()
            if (
                value !== this.value
            ) {
                // set new value
                const oldValue = this.value
                this.value = value
                this.cb.call(this.vm, value, oldValue)
            }
        }
    }

    /**
     * Depend on all deps collected by this watcher.
     */
    depend() {
        let i = this.deps.length
        while (i--) {
            this.deps[i].depend()
        }
    }
}