require('dotenv').config();
const mongoose = require('mongoose');
const Person = require('./person');

// Fonction de connexion à la base de données MongoDB
async function connectToMongoDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connexion à MongoDB réussie');
    } catch (error) {
        console.error('Erreur de connexion à MongoDB :', error);
    }
}

// Fonction pour créer et enregistrer une personne
async function createAndSavePerson() {
    const newPerson = new Person({
        name: 'Paul',
        age: 38,
        favoriteFoods: ['pizza', 'burritos'],
    });

    try {
        const savedPerson = await newPerson.save();
        console.log('Personne créée et enregistrée avec succès :', savedPerson);
    } catch (error) {
        console.error('Erreur lors de la sauvegarde de la personne :', error);
    }
}

// Fonction pour créer et enregistrer plusieurs personnes
async function createAndSavePeople() {
    const arrayOfPeople = [
        {
            name: 'Moussa',
            age: 30,
            favoriteFoods: ['croissant', 'crepe'],
        },
        {
            name: 'Alfred',
            age: 25,
            favoriteFoods: ['sushi', 'nems'],
        },
        {
            name: 'Mary',
            age: 40,
            favoriteFoods: ['tacos', 'burritos'],
        },
        {
            name: 'Pape',
            age: 35,
            favoriteFoods: ['yassa', 'maffé'],
        },
    ];

    try {
        const createdPeople = await Person.create(arrayOfPeople);
        console.log('Personnes créées et enregistrées avec succès :', createdPeople);
    } catch (error) {
        console.error('Erreur lors de la création des personnes :', error);
    }
}

// Fonction pour rechercher des personnes par nom avec Model.find()
async function searchPeopleByName(name) {
    try {
        const peopleWithGivenName = await Person.find({ name });
        console.log('Personnes avec le nom recherché :', peopleWithGivenName);
    } catch (error) {
        console.error('Erreur lors de la recherche des personnes :', error);
    }
}

// Fonction pour rechercher une personne par aliment favori avec Model.findOne()
async function searchPersonByFavoriteFood(food) {
    try {
        const personWithFood = await Person.findOne({ favoriteFoods: food });
        if (personWithFood) {
            console.log('Personne avec l\'aliment recherché :', personWithFood);
        } else {
            console.log('Aucune personne trouvée avec l\'aliment recherché.');
        }
    } catch (error) {
        console.error('Erreur lors de la recherche de la personne :', error);
    }
}

// Fonction pour trouver une personne par son id avec Model.findById()
async function findPersonById(personId) {
    try {
        const person = await Person.findById(personId);
        if (person) {
            console.log('Personne trouvée par ID :', person);
        } else {
            console.log('Aucune personne trouvée avec cet ID.');
        }
    } catch (error) {
        console.error('Erreur lors de la recherche de la personne :', error);
    }
}

//Fonction pour effectuer des mises à jour classiques
async function findAndUpdatePersonById(personId) {
    try {
        const person = await Person.findById(personId);

        if (!person) {
            console.log('Aucune personne trouvée avec cet ID.');
            mongoose.connection.close();
        } else {
            // Mettre à jour la liste des aliments préférés en ajoutant "hamburger"
            person.favoriteFoods.push('hamburger');

            // Sauvegarder la personne mise à jour
            const updatedPerson = await person.save();
            console.log('Personne mise à jour avec succès :', updatedPerson);
        }
    } catch (error) {
        console.error('Erreur lors de la recherche de la personne :', error);
    }
}


// Fonction pour rechercher et mettre à jour une personne par nom avec Model.findOneAndUpdate()
async function findAndUpdatePersonByName(personName, newAge) {
    try {
        const updatedPerson = await Person.findOneAndUpdate(
            { name: personName },
            { age: newAge },
            { new: true }
        );

        if (!updatedPerson) {
            console.log('Aucune personne trouvée avec ce nom.');
        } else {
            console.log('Personne mise à jour avec succès :', updatedPerson);
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la personne :', error);
    }
}


// Fonction pour supprimer une personne par son ID avec Model.findByIdAndRemove()
async function deletePersonById(personId) {
    try {
        const deletedPerson = await Person.findByIdAndRemove(personId);

        if (!deletedPerson) {
            console.log('Aucune personne trouvée avec cet ID.');
        } else {
            console.log('Personne supprimée avec succès :', deletedPerson);
        }
    } catch (error) {
        console.error('Erreur lors de la suppression de la personne :', error);
    }
}

// Fonction pour supprimer toutes les personnes avec un nom donné en utilisant Model.deleteMany()
async function deletePeopleByName(name) {
    try {
        const result = await Person.deleteMany({ name });

        if (result.deletedCount > 0) {
            console.log(`Suppression réussie de ${result.deletedCount} personnes avec le nom "${name}".`);
        } else {
            console.log(`Aucune personne avec le nom "${name}" n'a été trouvée.`);
        }
    } catch (error) {
        console.error('Erreur lors de la suppression des personnes :', error);
    }
}

// Fonction pour rechercher des personnes qui aiment les burritos
async function findPeopleWhoLikeBurritos() {
    try {
        const query = Person.find({ favoriteFoods: 'burritos' })
            .sort('name') // Trier les résultats par nom
            .limit(2) // Limiter les résultats à deux documents
            .select('-age'); // Masquer l'âge

        const data = await query.exec();
        console.log('Personnes qui aiment les burritos (triées par nom, limitées à 2, âge masqué) :', data);
    } catch (error) {
        console.error('Erreur lors de la recherche des personnes :', error);
    }
}

// Fonction principale asynchrone pour exécuter les opérations
async function main() {
    await connectToMongoDB();
    await createAndSavePerson();
    await createAndSavePeople();
    await searchPeopleByName('Paul');
    await searchPersonByFavoriteFood('pizza');
    await findPersonById('6524a50a89046ae44e453660');
    await findAndUpdatePersonById('6524a50a89046ae44e453661');
    await findAndUpdatePersonByName('Pape', 20);
    await deletePersonById('6524a50a89046ae44e453663');
    await deletePeopleByName('Mary');
    await findPeopleWhoLikeBurritos();

    mongoose.connection.close();
}

// Exécution de la fonction principale
main().catch((error) => {
    console.error('Une erreur est survenue :', error);
});

