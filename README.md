# magnetik-backend

Backend for Magnetik, a magnetic poetry web app

## Data Sourcing

### Plan

The word data for Magnetik will come from a few different open source lists of English words.

I will use the Python natural languate processing (NLP) library [spaCy] (https://spacy.io/) to tag listed words with their parts of speech (POS), then save the words and tags to the Magnetik database.

Each time a new canvas is created by a user, they will be given a random assortment of words across all parts of speech that they can use to create their poems.

### Word List Sources

Some combination of the following word lists will be used:
- 10,000 most common English words: https://github.com/first20hours/google-10000-english
- Word lists sorted by topics: https://github.com/imsky/wordlists
- English vocabulary lists: https://github.com/jnoodle/English-Vocabulary-Word-List

### Challenges and Considerations
- Users will need an assortment of all parts of speech. Unlike the other possible sources, the list of 10,000 most common English words includes articles, prepositions, and pronouns, but it also includes misspelled words and potentially offensive terms (even in the lists that have been checked for swear words).
- It may be preferable (though tedious) to make a separate list of articles, prepositions, etc and then use one of the other lists. Doing this for suffixes and other odd bits wil probably be necessary.
- Using [lemmas] (https://en.wikipedia.org/wiki/Lemma_(morphology\)) might be better than using the word lists as they are, so users can, for instance, conjugate verbs or make one part of speech into another (e.g, milk could be a noun or a verb or be made into an adjective). SpaCy has a lemmatization feature.
