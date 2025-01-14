import { Button } from 'flowbite-react';

export default function CallToAction() {
    return (
        <div className='flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center'>
            <div className="flex-1 justify-center flex flex-col">
                <h2 className='text-2xl'>
                    This is university project, all data is not 100% correct.
                </h2>
                <p className='text-gray-500 my-2'>
                    checkout page for more detail
                </p>
                <Button gradientDuoTone='purpleToPink' className='rounded-tl-xl rounded-bl-none'>
                    <a href="https://www.collegedekho.com/colleges/kamani-science-college" target='_blank' rel='noopener noreferrer'>
                        More details
                    </a>
                </Button>
            </div>
            <div className="p-4 flex-1">
                <img src=".././clg2.jpeg" />
            </div>
        </div>
    )
}