import Select from 'react-select'
import { Country, State } from 'country-state-city'
import ReactCountryFlag from "react-country-flag"

const CountryStateSelector = ({
  country,
  state,
  onCountryChange,
  onStateChange,
  isEditing
}) => {
  const countries = Country.getAllCountries().map(country => ({
    value: country.isoCode,
    label: country.name,
    flag: country.isoCode,
    phonecode: country.phonecode
  }))

  const states = State.getStatesOfCountry(country?.value).map(state => ({
    value: state.isoCode,
    label: state.name
  }))

  return (
    <div className="space-y-4">
      <div className="form-group">
        <label>Country</label>
        <Select
          options={countries}
          value={country}
          onChange={onCountryChange}
          placeholder="Select Country"
          isDisabled={!isEditing}
          formatOptionLabel={(option) => (
            <div className="flex items-center gap-2">
              <ReactCountryFlag
                countryCode={option.value}
                svg
                style={{ width: '1.5em', height: '1.5em' }}
              />
              <span>{option.label}</span>
              <span className="text-gray-500 ml-2">+{option.phonecode}</span>
            </div>
          )}
          styles={{
            control: (base) => ({
              ...base,
              padding: '6px',
              borderRadius: '8px',
              borderColor: '#e5e7eb',
              '&:hover': { borderColor: '#ef4444' }
            }),
            option: (base, { isSelected }) => ({
              ...base,
              backgroundColor: isSelected ? '#ef4444' : 'white',
              color: isSelected ? 'white' : 'black',
              '&:hover': { backgroundColor: '#fee2e2' }
            })
          }}
        />
      </div>

      {country && (
        <div className="form-group">
          <label>State/Province</label>
          <Select
            options={states}
            value={state}
            onChange={onStateChange}
            placeholder="Select State"
            isDisabled={!isEditing}
            styles={{
              control: (base) => ({
                ...base,
                padding: '6px',
                borderRadius: '8px',
                borderColor: '#e5e7eb',
                '&:hover': { borderColor: '#ef4444' }
              })
            }}
          />
        </div>
      )}
    </div>
  )
}

export default CountryStateSelector