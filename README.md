# pwdgen2
***pwdgen2*** is a password generator that mainly build up with TypeScript, and it provides a flexible and customizable way to generate strong passwords based on different patterns. It allows you to create passwords that meet specific criteria, making them more secure and suitable for various use cases.
## Features
### Password Generator

Generate strong passwords based on predefined patterns.


### Customizable Patterns

#### Properties
##### pattern_name
`pattern_name` is a string that will be displayed at the page called "Add Password".


##### pattern_icon
`pattern_icon` is a string that can specify the icon being displayed before the name. You can search the icons form the website [fonts.google.com/icons](https://fonts.google.com/icons), copy the identity in "Instering the icon" section, and paste it to here to add icon.


##### pattern
`pattern` is a array that load up the generation configuration. This part is complex, so let's go to the next chapter!



#### Component
* A component must be loaded up in an `array`.
* There're 4 types of components that you can use, including `string`, `regex`, `list`, and `group`.
* A component must comes in `object` type (for JavaScript).
* The generation process is progressive and cumulative like writing from left to right, and the generator will generate string according to your configuration step by step.


##### Types

###### string
A string component will make generator directly put a string you specified to the current end of the result.


###### regex
"regex" reperesents "regular expression", it will tell generator what characters can appears in the generation result, in other words, you can use this type to select character sources being used.


###### list
A list component can only contains string, and the generator will randomly choose one to put at end of the rseult at one time.


###### group
A group component can load up 3 types of components mentioned above, and you can make the generator carry out actions to the result of a group.


##### Properties of a component

###### type

This property are applicable and required for all the types.


###### [type]
This property is the content of a component, and the property name is depending on the type. For example, if there's a `string` component, `string` property is applicable and required, and it look like `{"type": "string", "string": "content"}`


###### repeat
The value of this boolean property has two options, `true` or `false`. To ensure that the characters from the sources `regex` or `list` will not appear repeatedly, you need to set this to `false`. In addition, if all the characters or items are consumed, generator will use the alternative value "undefined".


###### quantity
This property comes in `number`, specifying the times of choosing actions. This is applicable and required for some types of components, including `regex` and `list`.


###### actions
This property comes in `array`,and the available value is `shuffle` at this time. This property is only for the component `group`.


###### id
This property will be generated and added to every component automatically by editor.


### Search

#### Search Index Creation
This application offers a `createSearchIndex` function that creates an index for efficient search operations. The index contains data from saved passwords, such as passwords, websites, notes, usernames, and timestamps, making it easier to find passwords based on different criteria.


#### Flexible Search

It allows users to search for passwords based on specific queries. It supports partial matches and returns relevant results, including passwords, websites, usernames, and timestamps, that match the search query.


#### Hashtags and Date Search

It provides the ability to search for passwords using hashtags and dates. Users can find passwords associated with specific hashtags and narrow down their search based on date ranges.


#### Password Length Search

The library allows users to search for passwords based on their length. This feature is particularly useful when looking for passwords with specific security requirements.


#### Similarity Suggestions

The library calculates similarity scores using Jaro-Winkler distance to provide well ordering of suggestions.

### Storage

#### Encrypted Password Storage

It store password in encrypted format (AES) and other data in plain text using the `window.localStorage` API. 


#### Password Creation and Modification

Users can add new passwords or modify existing ones. When creating a new password, the module generates a unique ID for each entry and securely stores the encrypted password, username, website, and other relevant information.


#### Password Removal

It provides a way to remove saved passwords based on their unique IDs. This ensures that users can easily delete passwords they no longer need.


#### Password Listing

Users can list their saved passwords, which are decrypted and presented in a human-readable interface. The list is sorted based on the timestamp of when the passwords were added or modified.


#### Data Import and Export

This application supports data import and export functionalities. The export function creates a JSON file containing all the saved passwords and their metadata.


### Password

#### Common Word Pattern Check

This feature examines passwords for common word patterns, aiming to detect possible vulnerabilities. By comparing the password with a list of known common words, it prompts users to steer clear of such patterns. It ensures password uniqueness by searching for frequently used combinations, guiding users to avoid commonly employed patterns for enhanced security.


#### Randomness Analysis

It assesses the randomness of the password's character arrangement. It looks for patterns or ordered sequences and encourages users to create more random and unpredictable passwords.


#### Length Assessment

It evaluates the length of the password, emphasizing the importance of having a sufficiently long password to enhance security.


#### Character Complexity Analysis

It analyzes the complexity of the password by examining the distribution of uppercase letters, lowercase letters, digits, and other character types. It encourages users to create passwords with diverse character types for improved security.


#### Color-Coded Feedback

It provides color-coded feedback, making it easier for users to identify the security level of their passwords at a glance. Different colors represent different security levels.


## Roadmap
- Users can import password data from a JSON file, allowing for easy migration from other systems or backups.
- For fuzzy search queries, it offers similarity suggestions to help users find relevant passwords even if the exact search term is not available. 


## Materials
* fonts: [`Noto Sans`](https://fonts.google.com/noto/specimen/Noto+Sans)
* icons: [`Material Symbols`](https://fonts.google.com/icons)