import './assets/style.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useEffect, useState} from "react";
import axios from 'axios'
import _ from 'lodash'
import moment from "moment";

function App() {
    const TIME_FORMAT = 'LLLL'
    const [authors, setAuthors] = useState(null)
    const [posts, setPosts] = useState(null)
    const [tableData, setTableData] = useState(null)

    useEffect(() => {
        loadAuthors()
        loadPosts()
    }, [])

    useEffect(() => {
        if (posts && authors) {
            const mapTableData = _.map(posts, post => {
                const author = authors[post.author_id]
                return _.merge(post, author)
            })
            setTableData(mapTableData)
        }
    }, [posts, authors])

    function loadAuthors() {
        axios.get('https://maqe.github.io/json/authors.json').then(response => {
            const mapAuthors = {}
            _.each(response.data, author => {
                mapAuthors[author.id] = author
            })
            setAuthors(mapAuthors)
        }).catch(error => {
            console.error({error})
        })
    }

    function loadPosts() {
        axios.get('https://maqe.github.io/json/posts.json').then(response => {
            setPosts(response?.data)
        }).catch(error => {
            console.error({error})
        })
    }

    return (
        <div className="forum-container">
            <div id="maqe-forum">
                <h1 id="header">MAQE Forum</h1>
                <p className="mt-4">Your current timezone is: Asia/Bangkok</p>
                <div id="forum-list">
                    {
                        _.map(tableData, (data, index) => {
                            return (<div className={`forum mt-3 ${index % 2 ? 'bg-light-blue' : 'bg-white'}`}
                                         key={index}>
                                <div className="forum-header d-flex align-items-center py-2 px-3">
                                    <img className="avatar"
                                         src={data.avatar_url}
                                         width={25}
                                         height={25}/>
                                    <p className={'title mb-0'}>
                                        <span className="name">{data.name} </span>
                                        <span className="date">posted on {moment(data.created_at).format(TIME_FORMAT)}</span>
                                    </p>
                                </div>
                                <div className="forum-content py-2 px-3 d-flex">
                                    <img className="avatar"
                                         src={data.image_url}
                                         width="250"/>
                                    <div className="px-3 py-2">
                                        <h5>{data.title}</h5>
                                        <p>{data.body}</p>
                                    </div>
                                </div>
                            </div>)
                        })
                    }
                </div>
            </div>
        </div>
    );
}

export default App;
