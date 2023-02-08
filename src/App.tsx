import '../styles/index.scss'
import { BiBook } from 'react-icons/bi'
import { BsToggleOff, BsToggleOn } from 'react-icons/bs'
import { HiOutlineMoon, HiOutlineSun, HiOutlineSearch } from 'react-icons/hi'
import { SlArrowDown } from 'react-icons/sl'
import { FaPlayCircle, FaPauseCircle } from 'react-icons/fa'
import { FiExternalLink } from 'react-icons/fi'
import { useRef, useState, useEffect } from 'react'

interface FetchedData {
  word: string,
  phonetic: string,
  phonetics: {
    text: string,
    audio: string
  }[],
  sourceUrls: string,
  origin: string,
  meanings: {
    antonyms: string[],
    definitions: {
      definition: string,
      synonyms: string[],
      antonyms: string[]
    }[],
    partOfSpeech: string,
    synonyms: string[]
  }[]
}



function App() {
  const [fetchedData, setFetchedData] = useState<FetchedData[] | []>([])
  const [isPlay, setIsPlay] = useState(false)
  const [font, setFont] = useState('serif')
  const [iconRotate, setIconRotate] = useState('')
  const [keyDown, setKeyDown] = useState('')
  const [isSubmited, setIsSubmited] = useState(false)
  const [word, setWord] = useState('')
  const [darkTheme, setDarkTheme] = useState(false)
  const [wordNotFound, setWordNotFound] = useState(false)
  const ref = useRef<null | HTMLAudioElement>(null)

  useEffect(() => {
    if (isSubmited) {
      fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then(res => {
          if (res.ok)
            return res.json()
          else setWordNotFound(true)
        })
        .then(data => setFetchedData(data))
      setIsSubmited(false)
      setWord('')

    }
  }, [isSubmited])

  useEffect(() => {
    if (darkTheme) {
      document.body.style.backgroundColor = '#343434'
      const select = document.querySelector('select') as HTMLSelectElement
      select.style.backgroundColor = '#343434' 
    }
    else {
    document.body.style.backgroundColor = ''
    const select = document.querySelector('select') as HTMLSelectElement
    select.style.backgroundColor = '' 
    }
  }, [darkTheme])

  const colorWhite = () => {
    if (darkTheme) return '#fff'
    else return ''
  }


  const onPlayButtonHandler = () => {
    if (ref.current !== null) {
      setIsPlay(true)
      ref.current.play()
    }
  }
  return (
    <div className="container" style={{ fontFamily: font}}>
      <header>
        <section className='header-top' style={{ color: colorWhite() }}>
          <div>
            <BiBook />
          </div>
          <div>
            <div className='right-side-header'>
              <div>
                <select defaultValue='serif'
                  style={{ color: colorWhite() }}
                  onMouseLeave={() => setIconRotate('')}
                  onClick={() => setIconRotate('icon-rotate')}
                  // onBlur={() => setIconRotate('')}
                  onChange={(e) => setFont(e.target.value)}>
                  <option value='serif'>Serif</option>
                  <option value='sans-serif'>Sans-serif</option>
                  <option value='monospace'>Monospace</option>
                </select>
                <SlArrowDown className={iconRotate} />
                {/* <span>Serif</span> */}
              </div>
              <div>{darkTheme ?
                (<>

                  <BsToggleOn className='toggle-icon' onClick={() => setDarkTheme(false)} />
                  <HiOutlineSun />
                </>)
                : (<>
                  <BsToggleOff className='toggle-icon' onClick={() => setDarkTheme(true)} />
                  <HiOutlineMoon />
                </>)}
              </div>
            </div>
          </div>
        </section>
        <section className='header-bottom'>
          <span>{keyDown}</span>
          <input type='text' placeholder='Your word' value={word}
            onKeyUp={(e) => {
              setKeyDown(e.code)
            }}
            onChange={(e) => {
              setWord(e.target.value)
            }}
            onKeyDown={(e) => { 
              if (e.code === 'Enter' || e.code === 'NumpadEnter') {
                setFetchedData([])
                setIsSubmited(true)
                setWordNotFound(false)
              }
            }}></input>
          <HiOutlineSearch className='search-icon' onClick={() => {
            setFetchedData([])
            setIsSubmited(true)
            setWordNotFound(false)
          }} />
        </section>
      </header>
      {wordNotFound && (<p className='error-msg'>Sorry. We have nothing for you...</p>)}
      {!wordNotFound && fetchedData.length !== 0 && (<main>
        <section className='word'>
          <div>
            <h1 style={{ color: colorWhite() }}>{fetchedData[0].word}</h1>
            <span>{fetchedData[0].phonetic}</span>
          </div>
          <div className='play-icon'>
            <div >
              {!isPlay ?
                (<FaPlayCircle onClick={() => onPlayButtonHandler()} />)
                : (<FaPauseCircle onClick={() => {
                  ref.current?.pause()
                  setIsPlay(false)
                }} />)}
              <audio
                src={fetchedData[0].phonetics.filter(item => item.audio !== '')[0]?.audio}
                ref={ref}
                onEnded={() => setIsPlay(false)}>
              </audio>
              <div className='icon-background'>
              </div>
            </div>
          </div>
        </section>

        {fetchedData[0].meanings.map(item => (
          <section className='word-meanings'>
            <div className='heading'>
              <h2 style={{ color: colorWhite() }}>{item.partOfSpeech}</h2>
              <div><hr /></div>
            </div>
            <div className='body-meanings'>
              <h3>Meaning</h3>
              <ul style={{ color: colorWhite() }}>
                {item.definitions.map(def => (
                  <li>{def.definition}</li>
                ))}
              </ul>
            </div>
            {item.synonyms?.length !== 0 &&
              (<div className='body-synonyms'>
                <h3 style={{ color: colorWhite() }}>Synonyms</h3>
                {item.synonyms.map(syn => (
                  <span>{syn}</span>
                ))}
              </div>)}
          </section>))}
      </main>)}
      {!wordNotFound && fetchedData.length !== 0 &&
        (<footer>
          <h4 >Source</h4>
          <a style={{ color: colorWhite() }} href={fetchedData[0]?.sourceUrls} target='_blank'>{fetchedData[0]?.sourceUrls}</a>
          <FiExternalLink />
        </footer>)}
    </div>
  )
}

export default App
