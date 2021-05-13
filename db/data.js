const persons=[
    {id:0,name:'John'},
    {id:1,name:'Jane'}
];

module.exports = {getPerson, insertPerson, updatePerson, removePerson};

function getPerson(id) {
    return persons.find(p => p.id === +id);
}

function insertPerson(p) {
    p.id = persons.length;
    persons.push(p);
    return p;
}

function removePerson(id) {
    persons = persons.filter(p => p.id !== +id);
}

function updatePerson(person) {
    persons = persons.map(p => p.id === +person.id ? person : p);
}