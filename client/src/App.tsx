import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { YMaps, Map, Polygon, Placemark } from 'react-yandex-maps'

interface IPayload {
  $id: string
  Id: number
  IsRemoved: boolean
  Location: Location
  Name: string
  OrganizationId: number
  Size: number
  SyncDate: string
  SyncId: string
}

type Location = {
  Center: number[]
  Polygon: number[][]
}

const apiUrl = 'http://localhost:8000/data'

function App(): JSX.Element {
  const [payload, setPayload] = useState<IPayload[]>([])
  const [defaultPositionCenter, setDefaultPositionCenter] = useState<number[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setLoading(true)
    axios
      .get<IPayload[]>(apiUrl)
      .then(({ data }) => {
        const changedData = data.map((i: any) => ({
          ...i,
          Location: JSON.parse(i.Location),
        }))
        setPayload(changedData ?? [])
        setDefaultPositionCenter(changedData[5]?.Location?.Center ?? [])
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      {loading ? (
        <h1>loading...</h1>
      ) : (
        <YMaps>
          <Map
            defaultState={{ center: defaultPositionCenter, zoom: 14, type: 'yandex#satellite' }}
            modules={['package.full']}
            style={{ width: 1000, height: 800 }}
          >
            {payload.map((e) => (
              <React.Fragment key={e.Id}>
                <Polygon
                  geometry={[e.Location.Polygon]}
                  options={{ fill: false, strokeColor: '#fff', strokeWidth: 3 }}
                />
                <Placemark
                  geometry={e.Location.Center}
                  properties={{ hint: e.Name, balloonContent: e.Name, iconContent: e.Name }}
                  options={{
                    iconLayout: 'default#imageWithContent',
                    iconImageHref: 'https://cdn-icons-png.flaticon.com/512/5077/5077615.png',
                    iconImageSize: [35, 35],
                  }}
                />
              </React.Fragment>
            ))}
          </Map>
        </YMaps>
      )}
    </>
  )
}

export default App
