const pokemonsContainer = document.querySelector('.pokemons');
const apiURL = "https://pokeapi.co/api/v2/pokemon";

const pokemons = [];

const getPokemons = async () => {
    const response = await fetch(apiURL);
    let {results} = await response.json();
    results = results
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
    let pokes = results.slice(0, 5);
    pokemons.push(...pokes);
    await getPokemonStats();
}

const getPokemonStats = async () => {
    pokemons.forEach(async (pokemon, index) => {
        const response = await fetch(pokemon.url);
        const {abilities, height, base_experience, sprites} = await response.json();
        pokemons[index].abilities = abilities;
        pokemons[index].height = height;
        pokemons[index].base_experience = base_experience;
        pokemons[index].sprites = sprites.front_default;
    })
    setTimeout(() => {
        showPokemons();
    }, 100)
}

getPokemons();
const showPokemons = () => {
    pokemons.forEach((pokemon, index) => {
        pokemonsContainer.innerHTML += `
            <div class="pokemon">
                <img src="${pokemon.sprites}" alt="Pokemon Image" onClick="getMoreStats(${index})">
                <h3>${pokemon.name}</h3>
            </div>
        `
    })
}

const name = document.querySelector('.name')
const abilities = document.querySelector('.abilities')
const height = document.querySelector('.height')
const base = document.querySelector('.base')
const aname = document.querySelector('.aname')
const effect = document.querySelector('.effect')
const seffect = document.querySelector('.seffect')
const flavour = document.querySelector('.flavour')

const getMoreStats = (index) => {
  const allPokemons = [...document.querySelectorAll('.pokemon')]
  allPokemons.forEach(poke => {
    poke.classList.remove('active')
  })
  allPokemons[index].classList.add('active');
  document.querySelector('.abilitiess').classList.add('hidden')  
  document.querySelector('.specs').classList.remove('hidden')  
  abilities.innerHTML = '';
  const selectedPokemon = pokemons[index]
  let abs = selectedPokemon.abilities.map(ability => ability.ability.name)
  let absURL = selectedPokemon.abilities.map(ability => ability.ability.url);
  name.innerText = selectedPokemon.name
  height.innerText = selectedPokemon.height
  base.innerText = selectedPokemon.base_experience
  abs.forEach((ability, index) => {
    let span = document.createElement('span')
    span.textContent = ability + ' ';
    abilities.appendChild(span)
    span.addEventListener('click', getAbilityStats)
    span.dataset.url = absURL[index];
  })
}

const getAbilityStats = async (e) => {
    document.querySelector('.abilitiess').classList.remove('hidden')  
    const response = await fetch(e.target.dataset.url);
    const {name, effect_entries, flavor_text_entries} = await response.json();
    aname.innerText = name;
    effect.innerText = effect_entries[0].language.name == 'en' ? effect_entries[0].effect : effect_entries[1].effect;
    seffect.innerText = effect_entries[0].language.name == 'en' ? effect_entries[0].short_effect : effect_entries[1].short_effect
    flavour.innerText = flavor_text_entries[0].flavor_text
}
