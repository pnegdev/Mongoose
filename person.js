const mongoose = require('mongoose');

// Définition du modèle de personne
const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
    },
    favoriteFoods: {
        type: [String],
    },
});

const Person = mongoose.model('Person', personSchema);

module.exports = Person;
