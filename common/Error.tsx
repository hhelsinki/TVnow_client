const Error = (props:any) => {
    return (
        <section data-name='loading' className="fixed overlay">
            <div className="abs error text-lg txt-center bg-prim">
               {props.text}
            </div>
        </section>
    );
}

export default Error;