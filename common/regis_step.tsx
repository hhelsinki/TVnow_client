import styled from '../styles/register.module.scss';

const RegisStep = ({step, descrip}) => {

    return (
        <section className={styled['regis__step-container']}>
            <h3>{step}</h3>
            <h2>{descrip}</h2>
        </section>
    );
}

export default RegisStep;