# pwdgen2
***pwdgen2*** is a password generator mainly built with TypeScript, providing a flexible and customizable way to generate strong passwords based on different patterns. It allows you to create passwords that meet specific criteria, making them more secure and suitable for various use cases.

## Features

### Password Generator
Generate strong passwords based on predefined patterns.

### Customizable Patterns
#### Properties
##### pattern_name
`pattern_name` is a string that will be displayed on the page called "Add Password."

##### pattern_icon
`pattern_icon` is a string that can specify the icon displayed before the name. You can search for icons on the website [fonts.google.com/icons](https://fonts.google.com/icons), copy the identity from the "Inserting the icon" section, and paste it here to add the icon.

##### pattern
`pattern` is an array that loads up the generation configuration, and the items in the array are called `components`.

#### Components
* A component must be loaded up in an array.
* There are 4 types of components that you can use, including `string`, `regex`, `list`, and `group`.
* A component must come in object type (for JavaScript).
* The generation process is progressive and cumulative, like writing from left to right, and the generator will generate a string/text according to your configuration step by step.

##### Types
###### string
A string component will make the generator directly put a string you specified at the current end of the result.

###### regex
"Regex" represents "regular expression"; it will tell the generator what characters can appear in the generation result. In other words, you can use this type to select character sources to be used.
Regular expression must be provided in full format, including expression and flags. Flags is a settings that affect the behavior of the regular expression. For example, the case-insensitive flag `i` allows matching regardless of letter case.

###### list
A list component can only contain strings, and the generator will randomly choose one to put at the end of the result at one time.

###### group
A group component can load up 3 types of components mentioned above, and you can make the generator carry out actions on the result of a group.

##### Properties of a component
###### type
This property is applicable and required for all the types.

###### [type]
This property is the content of a component, and the property name depends on the type. For example, if there's a `string` component, the `string` property is applicable and required, and it looks like `{"type": "string", "string": "content"}`.

###### repeat
The value of this boolean property has two options, `true` or `false`. To ensure that the characters from the sources `regex` or `list` will not appear repeatedly, you need to set this to `false`. In addition, if all the characters or items are consumed, the generator will use the alternative value `undefined`.

###### quantity
This property comes in `number`, specifying the times of choosing actions. This is applicable and required for some types of components, including `regex` and `list`.

###### actions
This property comes in `array`, and the available value is `shuffle` at this time. This property is only for the component `group`. For example, it might looks like `{"type": "group", "group": [...], "actions": ["shuffle", "shuffle", "shuffle"]`.

###### id
This property will be generated and added to every component automatically by the editor.

#### Example
```json
{
  "pattern_name": "example",
  "pattern_icon": "star",
  "pattern": [
    {
      "type": "group",
      "actions": [
        "shuffle",
        "shuffle",
        "shuffle"
      ],
      "group": [
        {
          "type": "list",
          "list": [
            "apple",
            "banana",
            "orange"
          ],
          "quantity": 1,
          "repeat": false,
          "id": "c-Yzdu6mPmhMGgeZOS"
        },
        {
          "type": "string",
          "string": "-",
          "id": "c-dYKsBme39vD4Dttq"
        },
        {
          "type": "regex",
          "regex": "/[A-Z]/g",
          "quantity": 3,
          "repeat": true,
          "id": "c-xeK1yNDbZWxsGj1I"
        }
      ],
      "id": "c-jomUw6yVJvSP1xup"
    },
    {
      "type": "regex",
      "regex": "/[0-9]/g",
      "quantity": 3,
      "repeat": false,
      "id": "c-bg99oVwIPrTPAZyJ"
    }
  ]
}
```

### Search

#### Flexible Search
This application provides a flexible search feature with an search index, enabling efficient search operations for saved passwords. The index includes passwords, websites, notes, usernames, and timestamps, making it simple to find passwords using various keywords. Users can perform specific queries, including receiving relevant results containing passwords, websites, usernames, and timestamps that match their search query.

#### Hashtags and Date Search
It provides the ability to search for passwords using hashtags and dates. Users can find passwords associated with specific hashtags and narrow down their search based on date.

#### Password Length Search
The library allows users to search for passwords based on their length. This feature is particularly useful when looking for passwords with specific security requirements.

#### Similarity Suggestions
The library calculates similarity scores using Jaro-Winkler distance to provide a well-ordered list of suggestions.

### Storage
#### Encrypted Password Storage
It stores passwords in an encrypted format (AES) and other data in plain text using the `window.localStorage` API.

#### Password Creation and Modification
Users can add new passwords or modify existing ones. When creating a new password, the module generates a unique ID for each entry and securely stores the encrypted password, username, website, and other relevant information.

#### Password Removal
It provides a way to remove saved passwords based on their unique IDs. This ensures that users can easily delete passwords they no longer need.

#### Password Listing
Users can list their saved passwords, which are decrypted and presented in a human-readable interface. The list is sorted based on the timestamp of when the passwords were added or modified.

#### Data Import and Export
This application supports data import and export functionalities. The export function creates a JSON file containing all the saved passwords and their metadata.

### Password Conditions
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
### Data
- [ ] Users can import password data from a JSON file, allowing for easy migration from other systems or backups.
### Search
- [ ] Fuzzy search: offers similarity suggestions to help users find relevant passwords even if the exact search term is not available.
- [ ] Search passwords by a date range.
### Patterns
  - [ ] Date Component: insert current date or relative date to generation result
	- [ ] Choose Method
	  - [x] Random (default)
    - [ ] Choose When Generate (List Only): display an interface to ask user
### Password
- [ ] Password Change History
  - [x] LocalStorage 
  - [ ] User Interface
- [ ] Password Property Depends on Types
  - [ ] Account (default)
    - Email
    - Username
    - Website
  - [ ] File
    - Filename
    - File Link
- [ ] Pin Password
- [ ] TOTP (Time-based One-Time Password) 2FA
### User Interface
- Supports for multiple Languages
- Use WebAuthn to lock access of passwords 
## Materials
* fonts: [Noto Sans](https://fonts.google.com/noto/specimen/Noto+Sans)
* icons: [Material Symbols](https://fonts.google.com/icons)