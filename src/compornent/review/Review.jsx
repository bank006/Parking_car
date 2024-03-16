import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './review.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-regular-svg-icons';

function Review(props) {

    const { showreviews, idhistory } = props.data
    const [display, set_display] = useState('none')
    const [oldsorereview, setoldscorereview] = useState()
    useEffect(() => {
        if (showreviews === true) {
            const IDproduct = idhistory.IDproduct
            set_display('')
            axios.get(`http://localhost:4001/review/getsum_review/${IDproduct}`)
                .then((res) => {
                    setoldscorereview(res.data)
                    getcout(IDproduct)
                }).catch((err) => {
                    console.log(err)
                })

        } else {
            set_display('none')
        }
    }, [showreviews])

    const [countreview, setcountreview] = useState([])

    const getcout = (IDproduct) => {
        axios.get(`http://localhost:4001/review/getcount_review/${IDproduct}`)
            .then((result) => {
                setcountreview(result.data)

            }).catch((err) => {
                console.log(err)
            })
    }

    const [rating, setRating] = useState(0);

    const handleStarClick = (selectedRating) => {
        setRating(selectedRating === rating ? 0 : selectedRating);
    };
    const sendreview_score = () => {
        const IDuser = idhistory.IDuser
        const IDproduct = idhistory.IDproduct
        const ratingscore = rating
        axios.post('http://localhost:4001/review/postscoreReview', { IDuser, IDproduct, ratingscore })
            .then((result) => {
                console.log("send review score success")
                updatescoreview(IDproduct)
            }).catch((err) => {
                console.log('error', err)
            })
    }

    const updatescoreview = (IDproduct) => {
        const countreviewplus = countreview.length + 1
        const totalscore = oldsorereview.totalScore + rating
        const averagescore = totalscore / countreviewplus
        axios.put(`http://localhost:4001/product/updatescorereview/${IDproduct}`, { averagescore })
            .then((success) => {
                console.log(success)
                window.location.reload();
            }).catch((err) => {
                console.log(err)
            })
    }

    const closereview =()=>{
        set_display('none')
    }

    return (
        <div style={{ display: display }} className='container-review'>
            <div className="allbox-review">
                <div className="box-review">
                    <div className="close-review">
                        <div onClick={closereview} className="item-close-review">
                            <img src="./public/Multiply.png" alt="" />
                        </div>
                    </div>
                    <div className='item-review'>
                        <div className="content-review">
                            <div className="title-review">
                                <p>ให้คะแนนและเขียนรีวิว</p>
                            </div>
                            <div className="star">
                                {[1, 2, 3, 4, 5].map((index) => (
                                    <FontAwesomeIcon
                                        key={index}
                                        icon={faStar}
                                        className={index <= rating ? "star-icon selected" : "star-icon"}
                                        onClick={() => handleStarClick(index)}
                                    />
                                ))}
                            </div>
                            <div className="btn-submit-score">
                                <button onClick={sendreview_score}>ตกลง</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Review