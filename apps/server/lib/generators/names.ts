
export const NAMES_DB = {
  EN: {
    first: ['James', 'Harry', 'Jack', 'Oliver', 'Charlie', 'George', 'William', 'Thomas', 'Declan', 'Mason', 'Phil', 'Bukayo', 'Jude', 'Trent', 'Marcus'],
    last: ['Smith', 'Jones', 'Kane', 'Sterling', 'Grealish', 'Pickford', 'Maguire', 'Stones', 'Walker', 'Rice', 'Mount', 'Foden', 'Saka', 'Bellingham', 'Alexander-Arnold']
  },
  ES: {
    first: ['Pedri', 'Gavi', 'Ferran', 'Ansu', 'Sergio', 'Jordi', 'Dani', 'Iker', 'Xavi', 'Andres', 'Carles', 'Gerard', 'Sergio', 'David', 'Isco'],
    last: ['Gonzalez', 'Busquets', 'Torres', 'Fati', 'Ramos', 'Alba', 'Carvajal', 'Casillas', 'Hernandez', 'Iniesta', 'Puyol', 'Pique', 'Busquets', 'Villa', 'Silva']
  },
  IT: {
    first: ['Gianluigi', 'Leonardo', 'Alessandro', 'Federico', 'Nicolo', 'Lorenzo', 'Marco', 'Ciro', 'Giorgio', 'Francesco', 'Andrea', 'Paolo', 'Roberto', 'Gennaro', 'Daniele'],
    last: ['Donnarumma', 'Bonucci', 'Bastoni', 'Chiesa', 'Barella', 'Insigne', 'Verratti', 'Immobile', 'Chiellini', 'Totti', 'Pirlo', 'Maldini', 'Baggio', 'Gattuso', 'De Rossi']
  },
  DE: {
    first: ['Manuel', 'Joshua', 'Leon', 'Leroy', 'Serge', 'Thomas', 'Kai', 'Ilkay', 'Antonio', 'Mats', 'Jamal', 'Timo', 'Julian', 'Marco', 'Toni'],
    last: ['Neuer', 'Kimmich', 'Goretzka', 'Sane', 'Gnabry', 'Muller', 'Havertz', 'Gundogan', 'Rudiger', 'Hummels', 'Musiala', 'Werner', 'Brandt', 'Reus', 'Kroos']
  },
  FR: {
    first: ['Kylian', 'Karim', 'Antoine', 'Paul', 'N&apos;Golo', 'Hugo', 'Raphael', 'Presnel', 'Theo', 'Kingsley', 'Ousmane', 'Aurelien', 'Eduardo', 'Christopher', 'Mike'],
    last: ['Mbappe', 'Benzema', 'Griezmann', 'Pogba', 'Kante', 'Lloris', 'Varane', 'Kimpembe', 'Hernandez', 'Coman', 'Dembele', 'Tchouameni', 'Camavinga', 'Nkunku', 'Maignan']
  },
  BR: {
    first: ['Neymar', 'Vinicius', 'Rodrygo', 'Casemiro', 'Thiago', 'Marquinhos', 'Alisson', 'Ederson', 'Gabriel', 'Raphinha', 'Antony', 'Richarlison', 'Lucas', 'Roberto', 'Dani'],
    last: ['Junior', 'Goes', 'Silva', 'Santos', 'Becker', 'Moraes', 'Jesus', 'Martinelli', 'Paqueta', 'Firmino', 'Alves', 'Carlos', 'Cafu', 'Ronaldo', 'Romario']
  },
  AR: {
    first: ['Lionel', 'Angel', 'Lautaro', 'Julian', 'Enzo', 'Alexis', 'Emiliano', 'Cristian', 'Rodrigo', 'Lisandro', 'Nicolas', 'Paulo', 'Leandro', 'Gonzalo', 'Sergio'],
    last: ['Messi', 'Di Maria', 'Martinez', 'Alvarez', 'Fernandez', 'Mac Allister', 'Romero', 'De Paul', 'Otamendi', 'Tagliafico', 'Dybala', 'Paredes', 'Higuain', 'Aguero', 'Zanetti']
  },
  ID: {
    first: ['Bambang', 'Boaz', 'Evan', 'Egy', 'Witan', 'Pratama', 'Asnawi', 'Elkan', 'Marselino', 'Rizky', 'Nadeo', 'Irfan', 'Stefano', 'Marc', 'Rachmat'],
    last: ['Pamungkas', 'Solossa', 'Dimas', 'Maulana', 'Sulaeman', 'Arhan', 'Mangkualam', 'Baggott', 'Ferdinan', 'Ridho', 'Argawinata', 'Bachdim', 'Lilipaly', 'Klok', 'Irianto']
  }
}

export type CountryCode = keyof typeof NAMES_DB
