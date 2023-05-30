import styled from '../styles/register.module.scss';

const RegisButtonSubmit = (props: any) => {
    //export default function RegisButtonSubmit(props:any){
    //const onClick = props.onClick;

    return (
        <button type='submit' className={`${styled['regis__form-submit']} bd-zero cursor`} disabled={props.isDisable}>CONTINUE</button>
    );
}

export default RegisButtonSubmit