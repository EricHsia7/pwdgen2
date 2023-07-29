# pwdgen2
**pwdgen2** is a password generator that mainly build up with TypeScript, and it provides a flexible and customizable way to generate strong passwords based on different patterns. It allows you to create passwords that meet specific criteria, making them more secure and suitable for various use cases.
## Features
### Password Generator
- Generate strong passwords based on predefined patterns.
- Customize password patterns to fit specific requirements.
- Support for different types of patterns, including regular expressions and character lists.
- Ability to shuffle password components for added complexity.
- Suitable for use in both production environments and editor/testing environments.
> [Learn more about it.](https://github.com/EricHsia7/pwdgen2/blob/main/pattern_docs/chapter1.md)

### Search
- **Search Index Creation**
This application offers a `createSearchIndex` function that creates an index for efficient search operations. The index contains data from saved passwords, such as passwords, websites, notes, usernames, and timestamps, making it easier to find passwords based on different criteria.
    
- **Flexible Search** 
It allows users to search for passwords based on specific queries. It supports partial matches and returns relevant results, including passwords, websites, usernames, and timestamps, that match the search query.
    
- **Hashtags and Date Search**  
It provides the ability to search for passwords using hashtags and dates. Users can find passwords associated with specific hashtags and narrow down their search based on date ranges.
    
- **Password Length Search** 
The library allows users to search for passwords based on their length. This feature is particularly useful when looking for passwords with specific security requirements.
    
- **Similarity Suggestions** 
For fuzzy search queries, Xsearch offers similarity suggestions to help users find relevant passwords even if the exact search term is not available. The library calculates similarity scores using Jaro-Winkler distance to provide well ordering of suggestions.

### Storage
- **Encrypted Password Storage**
It store password in encrypted format (AES) and other data in plain text using the `window.localStorage` API. 

- **Password Creation and Modification**
Users can add new passwords or modify existing ones. When creating a new password, the module generates a unique ID for each entry and securely stores the encrypted password, username, website, and other relevant information.

- **Password Removal**
It provides a way to remove saved passwords based on their unique IDs. This ensures that users can easily delete passwords they no longer need.

- **Password Listing**
Users can list their saved passwords, which are decrypted and presented in a human-readable interface. The list is sorted based on the timestamp of when the passwords were added or modified.

- **Data Import and Export**
This application supports data import and export functionalities. The export function creates a JSON file containing all the saved passwords and their metadata.

### Password 
- **Common Word Pattern Check**
This feature examines passwords for common word patterns, aiming to detect possible vulnerabilities. By comparing the password with a list of known common words, it prompts users to steer clear of such patterns. It ensures password uniqueness by searching for frequently used combinations, guiding users to avoid commonly employed patterns for enhanced security.

- **Randomness Analysis**
It assesses the randomness of the password's character arrangement. It looks for patterns or ordered sequences and encourages users to create more random and unpredictable passwords.

- **Length Assessment**
It evaluates the length of the password, emphasizing the importance of having a sufficiently long password to enhance security.

- **Character Complexity Analysis**
It analyzes the complexity of the password by examining the distribution of uppercase letters, lowercase letters, digits, and other character types. It encourages users to create passwords with diverse character types for improved security.

- **Color-Coded Feedback**
It provides color-coded feedback, making it easier for users to identify the security level of their passwords at a glance. Different colors represent different security levels.


## Roadmap
Users can import password data from a JSON file, **allowing for easy migration from other systems or backups.**


## Materials
* fonts: [`Noto Sans`](https://fonts.google.com/noto/specimen/Noto+Sans)
* icons: [`Material Symbols`](https://fonts.google.com/icons)