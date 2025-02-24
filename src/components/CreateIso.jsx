import React, { useEffect, useState } from 'react';

function CreateIso({ alltags, onclose }) {
    const [formData, setFormData] = useState({
        sNumber: '',
        sName: '',
        sheetNumber: '',
        tag: ''
    });

    // const [sisoNo,setsisoNo]=useState('')
    // const [sisoName,setsisoName]=useState('')
    // const [sisoSheetNo,setsisoSheetNo]=useState('')
    // const [sisotagId,setta]=useState('')

    useEffect(() => {
        console.log(alltags);

    }, [alltags])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        window.api.send('iso-sheet-reg', formData)
        onclose()
    };

    const handleclose = () => {
        onclose()
    }

    return (
        <div>
            <div id="createSmartISO" className="popup-screen">
                <div className="popup-bg"></div>

                <div className="popup-window">
                    <form className="popup" onSubmit={handleSubmit}>
                        <div style={{ justifyContent: 'space-between' }}>
                            <h2>Create Smart ISO</h2>
                            <i class="fa-regular fa-circle-xmark" onClick={handleclose}></i>
                        </div>


                        <div className="contents">
                            <input
                                type="text"
                                id="sNumber"
                                placeholder="Number"
                                maxLength="10"
                                required
                                value={formData.sNumber}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                id="sName"
                                placeholder="Name"
                                maxLength="120"
                                required
                                value={formData.sName}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                id="sheetNumber"
                                placeholder="Sheet number"
                                maxLength="10"
                                required
                                value={formData.sheetNumber}
                                onChange={handleChange}
                            />
                            <select
                                className="tagList"
                                id="tag"
                                required
                                value={formData.tag}
                                onChange={handleChange}
                            >
                                {/* Default Option */}
                                <option value="">Select Line</option>

                                {/* Mapping Branch Table Details */}
                                {alltags.map((line, index) => (
                                    <option key={index} value={line.number}>
                                        {line.number}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <input type="submit" value="Add" />
                        <hr className="popupBottom" />
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateIso;
