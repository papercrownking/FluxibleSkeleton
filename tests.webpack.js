const context = require.context('./test/unit', true, /\.spec\.js$/);

const Ap = Array.prototype;
const slice = Ap.slice;
const Fp = Function.prototype;

if (!Fp.bind) {
    Fp.bind = function init(contxt) {
        /*eslint-disable */
        const func = this;
        const args = slice.call(arguments, 1);

        function bound() {
            const invokedAsConstructor = func.prototype && (this instanceof func);
            return func.apply(
                !invokedAsConstructor && contxt || this,
                args.concat(slice.call(arguments))
            );
        }
        /*eslint-enable */
        bound.prototype = func.prototype;

        return bound;
    };
}

context.keys().forEach(context);
