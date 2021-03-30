import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Header, Grid, Segment, Image, Flag, Button, Label } from 'semantic-ui-react'
import ReactMapGL, { Marker } from 'react-map-gl'
import { userIsAuthenticated, getTokenFromLocalStorage, userIsOwner } from '../helpers/auth.js'


const FestivalPage = () => {

  const { id } = useParams()
  const [ festivalData, setFestivalData ] = useState()
  const [ userAttendingStatus, setUserAttendingStatus ] = useState(
    {
      interested: false,
      going: false
    }
  )


  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(`/api/festivals/${id}`)
        setFestivalData(data)
      } catch (err) {
        console.log(err)
      }
    }
    getData()
  },[userAttendingStatus])

  if (!festivalData) return null

  const { startDate, endDate, festivalName, mainFestivalImage, lineup, website, price, venue, country, latitude, longitude, festivalAttendance } = festivalData
  const startDateString = new Date(startDate).toDateString()
  const endDateString = new Date(endDate).toDateString()

  const interestedAttendance = festivalAttendance.filter(item => item.interested === true)
  const goingAttendance = festivalAttendance.filter(item => item.going === true)

  const userAttendence = festivalAttendance.filter(item => {
    return  userIsOwner(item.user)
  })

  console.log('USER check',userAttendence[0].interested)




  const handleAttendance = async event => {
    let strToBool = false
    if (event.target.value === 'true' ){
      strToBool = true
    } 
    const newUserStatus = { ...userAttendingStatus, [event.target.name]: !strToBool }
    try {
      await axios.post(`/api/festivals/${id}/attendance`,newUserStatus, {
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`
        }
      })
      setUserAttendingStatus(newUserStatus)
    } catch (err) {
      console.log(err)
    }

  }

  return (
    <Grid stackable container columns={3} divided>
      
      <Grid.Row stretched>
        <Grid.Column width={12}>
          <Segment>
            <Header>{festivalName}</Header>
            <Image src={`${mainFestivalImage}`} />
          </Segment>
        </Grid.Column>
        <Grid.Column width={4}>
          
          <Segment>
            <div>
              {startDateString}-{endDateString}
            </div>
            <div>
              {venue}
            </div>
            <div>
              <Flag name={country.toLowerCase()}/>
            </div>
          </Segment>
          <Segment>
            <Link to={website}>
              <p>{festivalName} website</p>
            </Link>
            £{price}
          </Segment>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row verticalAlign='middle' stretched>
        <Grid.Column width={4} textAlign='center' >
          { userIsAuthenticated() ? 
            <>
              <Segment>
                <Button as='div' labelPosition='right'>
                  <Button
                    name='interested'
                    value={userAttendingStatus.interested}
                    onClick={handleAttendance}
                  >
                      Interested
                  </Button>
                  <Label as='a' basic pointing='left'

                  >
                    { userAttendingStatus.interested ? 'Yes' : 'No' }
                  </Label>
                </Button>
              </Segment>
              <Segment>
                <Button as='div' labelPosition='right' >
                  <Button
                    onClick={handleAttendance}
                    name='going'
                    value={userAttendingStatus.going}
                  >
                      Going
                  </Button>
                  <Label as='a' basic pointing='left'>
                    { userAttendingStatus.going ? 'Yes' : 'No' }
                  </Label>
                </Button>
              </Segment>
            </>
            : <Segment>Login to add this festival to your account</Segment>
          }
          <Segment>
            { interestedAttendance.length === 1 ? 
              <p>{interestedAttendance.length} of our members is interested</p>
              : <p>{interestedAttendance.length} of our members are interested</p>
            }
            { goingAttendance.length === 1 ? 
              <p>{goingAttendance.length} of our members is going</p>
              : <p>{goingAttendance.length} of our members are going</p>
            }
          </Segment>

        </Grid.Column>
        <Grid.Column width={12}>
          <Segment className='map-container-medium'>
            <ReactMapGL 
              mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
              height='100%'
              width='100%'
              mapStyle='mapbox://styles/mapbox/light-v10'
              latitude={latitude}
              longitude={longitude}
              zoom={13}
            >
              <Marker latitude={latitude} longitude={longitude}>
                📍
              </Marker>
            </ReactMapGL>
          </Segment>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        {lineup.map(artist => {
          return <Grid.Column key={artist}>
            <Segment textAlign='center'>
              {artist}
            </Segment>
          </Grid.Column>
        })}
      </Grid.Row>
    </Grid>


  )
}

export default FestivalPage
