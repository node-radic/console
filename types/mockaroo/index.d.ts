declare namespace mockaroo {
    interface ClientConstructorOptions {
        apiKey?: string
        host?: string
        port?: number
        secure?: boolean
    }


    export type ClientGenerateOptionsFieldType = 'Animal' | 'Common' | 'NameAnimal' | 'Scientific' | 'NameApp' | 'Bundle' | 'IDApp' | 'NameApp' | 'VersionAvatarBase64' | 'Image' | 'URLBinomial' | 'DistributionBitcoin' | 'AddressBlankBooleanBuzzwordCar' | 'MakeCar' | 'ModelCar' | 'Model' | 'YearCatch' | 'PhraseCityColorCompany' | 'NameCountryCountry' | 'CodeCredit' | 'Card' | '#Credit' | 'Card' | 'TypeCurrencyCurrency' | 'CodeCustom' | 'ListDataset' | 'ColumnDateDepartment' | '(Corporate)Department' | '(Retail)Domain' | 'NameDrug' | 'CompanyDrug' | 'Name' | '(Brand)Drug' | 'Name' | '(Generic)Dummy' | 'Image' | 'URLDUNS' | 'NumberEINEmail' | 'AddressEncryptExponential' | 'DistributionFake' | 'Company' | 'NameFamily' | 'Name' | '(Chinese)FDA' | 'NDC' | 'CodeFile' | 'NameFirst' | 'NameFirst' | 'Name' | '(European)First' | 'Name' | '(Female)First' | 'Name' | '(Male)FormulaFrequencyFull' | 'NameGenderGender' | '(abbrev)Geometric' | 'DistributionGiven' | 'Name' | '(Chinese)GUIDHex' | 'ColorIBANICD10' | 'Diagnosis' | 'CodeICD10' | 'Dx' | 'Desc' | '(Long)ICD10' | 'Dx' | 'Desc' | '(Short)ICD10' | 'Proc' | 'Desc' | '(Long)ICD10' | 'Proc' | 'Desc' | '(Short)ICD10' | 'Procedure' | 'CodeICD9' | 'Diagnosis' | 'CodeICD9' | 'Dx' | 'Desc' | '(Long)ICD9' | 'Dx' | 'Desc' | '(Short)ICD9' | 'Proc' | 'Desc' | '(Long)ICD9' | 'Proc' | 'Desc' | '(Short)ICD9' | 'Procedure' | 'CodeIP' | 'Address' | 'v4IP' | 'Address' | 'v4' | 'CIDRIP' | 'Address' | 'v6IP' | 'Address' | 'v6' | 'CIDRISBNJob' | 'TitleJSON' | 'ArrayLanguageLast' | 'NameLatitudeLinkedIn' | 'SkillLongitudeMAC' | 'AddressMD5MIME' | 'TypeMoneyMongoDB' | 'ObjectIDMovie' | 'GenresMovie' | 'TitleNaughty' | 'StringNHS' | 'NumberNormal' | 'DistributionNumberParagraphsPasswordPhonePlant' | 'Common' | 'NamePlant' | 'FamilyPlant' | 'Scientific' | 'NamePoisson' | 'DistributionPostal' | 'CodeProduct' | '(Grocery)RaceRegular' | 'ExpressionRepeating' | 'ElementRow' | 'NumberScenarioSentencesSequenceSHA1SHA256Shirt' | 'SizeShort' | 'Hex' | 'ColorSloganSQL' | 'ExpressionSSNStateState' | '(abbrev)Stock' | 'IndustryStock' | 'MarketStock' | 'Market' | 'CapStock' | 'NameStock' | 'SectorStock' | 'SymbolStreet' | 'AddressStreet' | 'NameStreet' | 'NumberStreet' | 'SuffixSuffixTemplateTimeTime' | 'ZoneTitleTop' | 'Level' | 'DomainUniversityURLUser' | 'AgentUsernameWords'

    interface ClientGenerateOptionsField {
        [name:string]: any
        type?: ClientGenerateOptionsFieldType
        name?: string
    }

    interface ClientGenerateOptions {
        count?: number
        schema?: string
        format?: string
        header?: boolean
        fields?: ClientGenerateOptionsField[]
    }

    class Client {
        constructor(options: ClientConstructorOptions)

        generate(options:ClientGenerateOptions): Promise<object[]>
    }

    namespace errors {
        /**
         * Base for all errors
         */
        class ApiError extends Error {}

        /**
         * Thrown when a user exceeds the maximum number of records that can be generated
         * in a 24 hour period given their plan.  See usage limits here: http://mockaroo.com/api/docs
         */
        class UsageLimitExceededError extends ApiError {}

        /**
         * Thrown when an invalid api key is used.
         */
        class InvalidApiKeyError extends ApiError {}

    }


    export {Client, errors}
}
declare module "mockaroo" {
    export = mockaroo
}