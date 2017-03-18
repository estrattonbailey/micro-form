'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Field = exports.Form = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function completeAssign(target) {
  for (var _len = arguments.length, sources = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    sources[_key - 1] = arguments[_key];
  }

  sources.forEach(function (source) {
    Object.defineProperties(target, Object.keys(source).reduce(function (props, key) {
      props[key] = Object.getOwnPropertyDescriptor(source, key);
      return props;
    }, {}));
  });

  return target;
}

var Form = exports.Form = function (_Component) {
  _inherits(Form, _Component);

  function Form(props) {
    _classCallCheck(this, Form);

    var _this = _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).call(this, props));

    _this.state = {
      fields: {}
    };
    return _this;
  }

  _createClass(Form, [{
    key: 'getChildContext',
    value: function getChildContext() {
      var _ = this;

      return {
        update: function update() {
          _.forceUpdate();
        },
        updateFields: function updateFields(obj) {
          _.setState({
            fields: completeAssign(_.state.fields, obj)
          });
        },
        getFields: function getFields() {
          return _.state.fields;
        }
      };
    }
  }, {
    key: 'render',
    value: function render() {
      return this.props.children({
        fields: this.state.fields
      });
    }
  }]);

  return Form;
}(_react.Component);

Form.childContextTypes = {
  update: _react.PropTypes.func,
  updateFields: _react.PropTypes.func,
  getFields: _react.PropTypes.func
};

var Field = exports.Field = function (_Component2) {
  _inherits(Field, _Component2);

  function Field(props, context) {
    _classCallCheck(this, Field);

    var _this2 = _possibleConstructorReturn(this, (Field.__proto__ || Object.getPrototypeOf(Field)).call(this, props, context));

    _this2.state = {
      name: props.name,
      value: props.value
    };

    _this2.local = Object.defineProperty({}, _this2.state.name, {
      set: function set(value) {
        _this2.setState({ value: value });
        _this2.context.update();
      },
      get: function get() {
        return _this2.state.value;
      },
      enumerable: true
    });
    return _this2;
  }

  _createClass(Field, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.context.updateFields(this.local);
    }
  }, {
    key: 'render',
    value: function render() {
      var props = _extends({}, this.state, {
        fields: this.context.getFields()
      });

      return this.props.children(props);
    }
  }]);

  return Field;
}(_react.Component);

Field.contextTypes = {
  update: _react.PropTypes.func,
  updateFields: _react.PropTypes.func,
  getFields: _react.PropTypes.func
};