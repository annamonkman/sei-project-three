import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Grid, Dropdown, Container, Segment } from 'semantic-ui-react'

import FestivalCard from './FestivalCard'

// import image1 from '../../../backend/assets/mainFestivalImage/nos-alive-main.jpeg'

const FestivalIndex = () => {
  const [festivals, setFestivals] = useState([])
  // const [filteredCountries, setFilteredCountries] = useState([])
  const [filteredFestivals, setFilteredFestivals] = useState([])
  const [filterValueCountry, setFilterValueCountry] = useState('')
  const [filterValueArtist, setFilterValueArtist] = useState('')
  const [filterValuePrice, setFilterValuePrice] = useState('')
  console.log(filterValuePrice)

  let masterArray = []

  // * Semantic UI example
  // const countryOptions = [
  //   { key: 'af', value: 'af', flag: 'af', text: 'Afghanistan' },
  //   { key: 'ax', value: 'ax', flag: 'ax', text: 'Aland Islands' }
  // ]

  // const options = [
  //   { key: 'angular', text: 'Angular', value: 'angular' },
  //   { key: 'css', text: 'CSS', value: 'css' },
  //   { key: 'design', text: 'Graphic Design', value: 'design' },

  // const countryOptions = festivals.map((festival) => {
  //   <option key={festival._id}>{festival.country}</option>
  // })
  // console.log('countryoptions>> ', countryOptions)

  // * GET DATA
  useEffect(() => {
    const getData = async () => {
      const response = await axios.get('/api/festivals')
      setFestivals(response.data)
    }
    getData()

  }, [])

  // * HANDLE CHANGE ----------------------------------------------------------
  // * HANDLE CHANGE COUNTRIES
  const handleChangeCountries = (event) => {
    const filteredCountry = event.target.innerText
    console.log('ETV COUNTRY>>', filteredCountry)
    setFilterValueCountry(filteredCountry)
  }

  // * HANDLE CHANGE ARTISTS 
  const handleChangeArtists = (event) => {
    const filteredArtist = event.target.innerText
    console.log('ETV FILTERED ARTISTS>', filteredArtist)
    setFilterValueArtist(filteredArtist)
  }

  // * HANDLE CHANGE PRICE
  const handleChangePrice = (event, data) => {
    console.log(event)
    const filteredPrice = data.value
    console.log('ETV FILTERED PRICE>', filteredPrice)
    setFilterValuePrice(filteredPrice)
  }

  // * RETURN FILTERED FESTIVALS ----------------------------------------------
  // * FILTERED BY COUNTRY
  useEffect((event) => {
    if (!filterValueCountry) return (
      setFilteredFestivals(festivals)
    )
    console.log('event', event)
    const filteredFestCountry = festivals.filter(festival => {
      return festival.country === filterValueCountry
    })
    setFilteredFestivals(filteredFestCountry)
  }, [filterValueCountry, festivals])
  
  // * FILTERED BY ARTIST
  useEffect((event) => {
    if (!filterValueArtist) return (
      setFilteredFestivals(festivals)
    )
    console.log('event', event)
    const filteredFestArtist = festivals.filter(festival => {
      if (festival.lineup.includes(filterValueArtist) === true) {
        return festival.lineup
      } 
    })
    setFilteredFestivals(filteredFestArtist)
  }, [filterValueArtist, festivals])

  let filteredFestPrice = []

  // * FILTERED BY PRICE
  useEffect((event) => {
    if (!filterValuePrice) return (
      setFilteredFestivals(festivals)
    )
    console.log('event', event)
    console.log('FILTERVALUE PRICE>>', filterValuePrice)
    if (filterValuePrice === 'cheap') {
      filteredFestPrice = festivals.filter(festival => {
        return (festival.price <= 50)
        // console.log('festival price cheap', festival.price <= 50)
      })
    }
    if (filterValuePrice === 'midOne') {
      filteredFestPrice = festivals.filter(festival => {
        return (festival.price >= 50 && festival.price <= 100)
      })
    }
    if (filterValuePrice === 'midTwo') {
      filteredFestPrice = festivals.filter(festival => {
        return (festival.price >= 100 && festival.price <= 200)
      })
    }
    if (filterValuePrice === 'expensive') {
      filteredFestPrice = festivals.filter(festival => {
        return (festival.price >= 200)
      })
    }
    setFilteredFestivals(filteredFestPrice)
  }, [filterValuePrice, festivals])

  // * --------------------------------------------------------------------------------
  // * COUNTRIES FILTER
  let countries = festivals.map(festival => {
    return festival.country
  })
  const countriesSet = new Set(countries)
  countries = [...countriesSet]
  const countriesOptions = countries.map(country => {
    return { key: `${country}`, text: `${country}`, value: `${country}`, flag: `${country.toLowerCase()}` }
  })

  // * ARTISTS FILTER
  const festivalsLineupMapped = festivals.map(festival => {
    return festival.lineup
  })
  festivalsLineupMapped.forEach(artists => {
    const newArray = artists.map(artist => {
      return artist
    })
    masterArray = [... masterArray, ... newArray]
  })
  const artistsSet = new Set(masterArray.sort())
  const artistsMapped = [...artistsSet]
  const artistsOptions = artistsMapped.map(artist => {
    return { key: `${artist}`, text: `${artist}`, value: `${artist}` }
  })

  // * PRICE FILTER
  const priceOptions = [
    { key: 'cheap', text: 'under £50', value: 'cheap' },
    { key: 'midOne', text: '£50 - £100', value: 'midOne' },
    { key: 'midTwo', text: '£100 - 200', value: 'midTwo' },
    { key: 'expensive', text: 'over £200', value: 'expensive' }
  ]

  // * HANDLE RESET
  // const handleReset = (event) => {
    
  // }


  // * IF NO FESTIVALS
  if (!festivals) return null

  // * RETURN ---------------------------------------------------------------------------
  return (

    <Container textAlign='justified'>
      <Segment.Inline>

        { /* Semantic UI Countries*/ }
        <Dropdown
          clearable
          search
          selection
          options={countriesOptions}
          onChange={handleChangeCountries}
          placeholder='Country'
          // value={countriesOptions}
        />

        {/* <select name="filter" id="filter" onChange={handleChangeCountries}>
          <option value='All'>All</option>
          {countries.map(country => (
            <option key={country} 
              value={country}>
              {country}
            </option>
          ))}
        </select> */}

        {/* {festivals.map(festival => (
            <option key={festival._id}
              value={festival.country}
            >{festival.country}</option>
          ))} */}
        

        { /* Semantic UI Artists */ }
        <Dropdown placeholder='Artists' clearable selection options={artistsOptions} onChange={handleChangeArtists}/>

        { /* Semantic UI Price */ }
        <Dropdown placeholder='Price per day (£)' clearable selection options={priceOptions} onChange={handleChangePrice}/>



      </Segment.Inline>

      {/* <Segment.Inline>
        <Button basic inverted color='violet'>Submit</Button>
        <Button basic inverted color='violet'>Reset</Button>
      </Segment.Inline> */}

      

      <Grid centered stackable>
        <Grid.Row columns={3} centered>
          { filteredFestivals.map( festival => {
            return <Grid.Column key={festival._id}>
              <FestivalCard {...festival} />
            </Grid.Column> 
          })}
        </Grid.Row>
      </Grid>

      {/* <div className="index-pagination">
        <Pagination defaultActivePage={5} totalPages={10} />
      </div> */}

    </Container>

  )
  
}

export default FestivalIndex
