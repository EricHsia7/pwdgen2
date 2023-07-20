# Pattern Property
## Component
* A component must be loaded up in an array.
* There're 4 types of components that you can use, including `string`, `regex`, `list`, and `group`.
* A component must comes in `object` type (for JavaScript).
* The generation process is progressive and cumulative like writing from left to right, and the generator will generate string according to your configuration step by step.
## Types
### string
A string component will make generator directly put a string you specified to the current end of the result.

### regex
"regex" reperesents "regular expression", it will tell generator what characters can appears in the generation result, in other words, you can use this type to select character sources being used.

### list
A list component can only contains string, and the generator will randomly choose one to put at end of the rseult at one time.

### group
A group component can load up 3 types of components mentioned above, and you can make the generator carry out actions to the result of a group.

## Properties of a component
### type
This property are applicable and required for all the types.

### [type]
This property is the content of a component, and the property name is depending on the type. For example, if there's a `string` component, `string` property is applicable and required, and it look like `{"type": "string", "string": "content"}`

### repeat
The value of this boolean property has two options, `true` or `false`. To ensure that the characters from the sources `regex` or `list` will not appear repeatedly, you need to set this to `false`. In addition, if all the characters or items are consumed, generator will use the alternative value "undefined".

### quantity
This property comes in `number`, specifying the times of choosing actions. This is applicable and required for some types of components, including `regex` and `list`.

### actions
This property comes in `array`,and the available value is `shuffle` at this time. This property is only for the component `group`.
