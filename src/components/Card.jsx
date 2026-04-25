import '../styles/Card.css'

export default function Card({id, image, onClick}) {
    return (
            <div className="card"
                id={id}
                onClick={() => onClick(id)}>
                <img src={image}/>
            </div>
    )
}