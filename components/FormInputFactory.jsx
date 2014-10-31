var React = require("react");
var PropTypes = React.PropTypes;
var BSInput = require("react-bootstrap/Input");

function generateSelectInput(properties, key) {
 options = properties.options.map(function(option, key) {
   return (
     <option key={key} name={option.name}>
       {option.value}
     </option>
    );
  });
  return (
    <div>
      <BSInput
        type="select"
        key={key}
        label={properties.label}
        name={properties.name}
      >
        {options}
      </BSInput>
    </div>
  );
}

function generateTextInput(properties, key) {
  return (
    <BSInput
      type        ="text"
      key         ={key}
      label       ={properties.label}
      name        ={properties.name}
      defaultValue={properties.defaultValue}
      placeholder ={properties.placeholder}
      value       ={properties.value}
    />
  );
}

function generatePasswordInput(properties, key) {
   return (
     <BSInput
        type       ="password"
        key        ={key}
        label      ={properties.label}
        name       ={properties.name}
        placeholder={properties.placeholder}
      />
   );
 }

function generateRadioInputGroup(properties, key) {
  var name = properties.name;
  var group = properties.values.map(function(radio, key) {
    return (
      <BSInput type="radio" key={key} label={radio.label} name={name} value={radio.value} />
    );
  });

  return (
    <div className="form-inline" key={key}>
      {group}
    </div>
  );
}

function generateCheckboxInput(properties, key) {
  return (
    <BSInput
      key     ={key}
      type    ="checkbox"
      label   ={properties.label}
      name    ={properties.name}
      selected={properties.isChecked}
      onChange={properties.function} />
  );
}

function InputFactoryMethod(type, properties, key) {
  switch(type) {
    case "select":
      return generateSelectInput(properties,key);

    case "text":
      return generateTextInput(properties,key);

    case "radio":
      return generateRadioInputGroup(properties,key);

    case "checkbox":
      return generateCheckboxInput(properties,key);

    case "password":
      return generatePasswordInput(properties,key);

    default:
      throw new Error("Input type not found.");
  };
}

module.exports = InputFactoryMethod;
