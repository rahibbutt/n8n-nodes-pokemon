import { INodeType, INodeTypeDescription, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

export class Pokemon implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Pokemon',
        name: 'pokemonData',
        icon: 'file:pokemon.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"]}}',
        description: 'Get data from the Pokémon API',
        defaults: {
            name: 'Pokemon Data',
        },
        inputs: ['main'],
        outputs: ['main'],
        properties: [
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                options: [
                    {
                        name: 'Get Pokémon',
                        value: 'getPokemon',
                        description: 'Get data for a specific Pokémon',
                    },
                ],
                default: 'getPokemon',
            },
            {
                displayName: 'Pokémon Name or ID',
                name: 'pokemonName',
                type: 'string',
                default: 'pikachu',
                description: 'The name or ID of the Pokémon to fetch',
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];

        for (let i = 0; i < items.length; i++) {
            const pokemonName = this.getNodeParameter('pokemonName', i) as string;

            // Use full URL to avoid Invalid URL error
            const response = await this.helpers.httpRequest({
                method: 'GET',
                url: `https://pokeapi.co/api/v2/pokemon/${pokemonName}`,
                headers: {
                    Accept: 'application/json',
                },
            });

            returnData.push({ json: response });
        }

        return [returnData];
    }
}