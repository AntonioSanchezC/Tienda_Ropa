import useQuisco from "../hooks/useQuiosco";

export default function BottonSexDelete() {

    const { 
        gender,
        selectGender, } = useQuisco();

        const handleGenderClick = (gender) => {
            selectGender(gender);
        };


  return (
    <div>

        <button  onClick={() => handleGenderClick('')}>
            Borrar seso preestablecido
        </button>

    </div>
  )
}
