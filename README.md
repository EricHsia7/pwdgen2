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
* There are 5 types of components that you can use, including `string`, `regex`, `list`, `date`, and `group`.
* A component must come in object type (for JavaScript).
* The generation process is progressive and cumulative, like writing from left to right, and the generator will generate a string/text according to your configuration step by step.

##### Types
###### string
A string component will make the generator directly put a string you specified at the current end of the result.

###### regex
"Regex" represents "regular expression"; it will tell the generator what characters can appear in the generation result. In other words, you can use this type to select character sources to be used.
Regular expression must be provided in full format, including expression and flags. Flags is a settings that affect the behavior of the regular expression. For example, the case-insensitive flag `i` allows matching regardless of letter case.

###### list
A list component can only contain strings, and the generator will randomly choose one from the list to put at the end of the result at one time.

###### date
A date component will make the generator convert a date to a string according to the date pattern. This property comes in `string`, and a qualified date pattern must obey the format. The available values and format include `today`, `yesterday`, `tomorrow`, and `today#offset`. For example, the value can be `today#+7`, representing the date of 7 days from now.

Syntax of **today#offset**:
1. The `offset` must include an arithmetic operator and a number coming in string put following the operator.
2. The available operator are unary plus operator (+) and unary negation operator (-).
3. The number represents offset of the date from today.

###### group
A group component can load up 4 types of components mentioned above, and you can make the generator implement actions on the result of a group.

##### Properties of a component
###### type
This property is applicable and required for all the types.

###### [type]
This property is the content of a component, and the property name depends on the type. For example, if there's a `string` component, the `string` property is applicable and required, and it looks like `{"type": "string", "string": "content"}`.

###### repeat
The value of this boolean property has two options, `true` or `false`. To ensure that the characters from the sources `regex` or `list` will not appear repeatedly, you need to set this to `false`. In addition, if all the characters or items are consumed, the generator will use the alternative value `undefined`.

###### quantity
This property comes in `number`, specifying the times of choosing actions. This is applicable and required for some types of components, including `regex` and `list`.

###### date_pattern
This property is only for the component `date`. To make it function well, you need to write the pattern accoding to the format. The available keys include `YYYY`, `MM`, `M`, `DD`, `D`, `hh`, `h`, `mm`, `m`, `ss`, and `s`. The uppercase ones represent **Year**, **Month**, and **Date**. On the other hand, the lowercase ones represent **hours**, **minutes**, and **seconds**. Similarly, keys of both cases with longer length have a padding before the number. For example, you can fill this property in with `YYYY/MM/DD`.

The examples of values corresponding to the keys:
| Key | 2023-01-02T01:02:03 | 2023-10-20T10:20:30 |
| --- | --- | --- |
| YYYY | 2023 | 2023 |
| MM | 01 | 10 |
| M | 1 | 10 |
| DD | 02 | 20 |
| D | 2 | 20 |
| hh | 01 | 10 |
| h | 1 | 10 |
| mm | 02 | 20 |
| m | 2 | 20 |
| ss | 03 | 30 |
| s | 3 | 30 |

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

### Patterns
- [ ]  Date Component: insert current date or relative date to generation result
    - [ ]  Choose Method
        - [x]  Random (default)
        - [ ]  Choose manually in generating: display an interface to ask user
- [x]  Pattern Manager
    - [x] Edit existing pattern
    - [x] Delete existing pattern
    - [x] Share existing pattern via link

### Password

- [ ]  Password Change History
    - [x]  LocalStorage
    - [ ]  User Interface
- [ ]  Password Property Depends on Types
    - [ ]  Account (default)
        - [ ]  Email
        - [ ]  Username
        - [ ]  Website
        - [ ]  TOTP (Time-based One-Time Password) 2FA
    - [ ]  File
        - [ ]  Filename
        - [ ]  File Link
- [ ]  Pin Password
- [ ]  Locked Actions (e.g., copy, view, delete) with WebAuthn

### User Interface

- [ ]  Supports for multiple Languages
- [ ]  Use WebAuthn to lock access to passwords and Pattern Manager

### Search

- [ ]  For fuzzy search queries, it offers similarity suggestions to help users find relevant passwords even if the exact search term is not available.
- [ ]  Search passwords by a date range.

### Storage/Data

- [ ]  Users can import password data from a JSON file, allowing for easy migration from other systems or backups.

### Other
- [ ] Use WebAuthn to lock access of passwords 
- [x] Quit JQuery
- [x] Get on board with webpack
## Materials
* fonts: [Noto Sans](https://fonts.google.com/noto/specimen/Noto+Sans)
* icons: [Material Symbols](https://fonts.google.com/icons)
