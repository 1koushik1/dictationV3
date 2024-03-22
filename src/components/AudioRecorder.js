import React, { useState, useRef } from "react";
import ReactQuill from "react-quill";
import { saveAs } from 'file-saver';
import { pdfExporter } from 'quill-to-pdf';
import htmlDocx from 'html-docx-js/dist/html-docx';
import "react-quill/dist/quill.snow.css";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const modules = {
    toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }],
        [{ size: [] }],
        [{ align: '' }, { align: 'center' }, { align: 'right' }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
        ],
        ["link", "image", "video"],
    ],
};

const AudioRecorder = () => {

    const commands = [
        {
            command: 'delete',
            callback: () => {
                if (window.confirm('Are you sure you want to delete all report data?')) {
                    setSaveNotes([]);
                    SpeechRecognition.stopListening();
                    resetTranscript();
                    localStorage.clear();
                    setIsAutoListening(false);
                }
                else {
                    SpeechRecognition.stopListening();
                    resetTranscript();
                }
            }
        },
        {
            command: 'next line',
            callback: () => {
                stopListening();
                if (isAutoListening) {
                    setTimeout(startListening, 500);
                }
            }
        },
        {
            command: 'title *',
            callback: (title) => {
                let upperCaseText = title.toUpperCase();
                const newValue = saveNotes + '<h1 class="ql-align-center"><strong><u>' + upperCaseText + '</u></strong></h1><br/>';
                setSaveNotes(newValue);
                localStorage.setItem('transcript', newValue);
                stopCommand();
                if (isAutoListening) {
                    setTimeout(startListening, 500);
                }
            }
        },
        {
            command: 'history',
            callback: () => {
                stopListening();
                const newValue = saveNotes + '<br/><h2><strong>' + "Clinical History: " + '</strong></h2>';
                setSaveNotes(newValue);
                localStorage.setItem('transcript', newValue);
                if (isAutoListening) {
                    setTimeout(startListening, 500);
                }
            }
        },
        {
            command: 'technique',
            callback: () => {
                stopListening();
                const newValue = saveNotes + '<br/><h2><strong>' + "Technique: " + '</strong></h2>';
                setSaveNotes(newValue);
                localStorage.setItem('transcript', newValue);
                if (isAutoListening) {
                    setTimeout(startListening, 500);
                }
            }
        },
        {
            command: 'findings',
            callback: () => {
                stopListening();
                const newValue = saveNotes + '<br/><h2><strong>' + "Findings: " + '</strong></h2>';
                setSaveNotes(newValue);
                localStorage.setItem('transcript', newValue);
                if (isAutoListening) {
                    setTimeout(startListening, 500);
                }
            }
        },
        {
            command: 'impression',
            callback: () => {
                stopListening();
                const newValue = saveNotes + '<br/><h2><strong>' + "Impression: " + '</strong></h2>';
                setSaveNotes(newValue);
                localStorage.setItem('transcript', newValue);
                if (isAutoListening) {
                    setTimeout(startListening, 500);
                }
            }
        },
        {
            command: 'advice',
            callback: () => {
                stopListening();
                const newValue = saveNotes + '<br/><h2><strong>' + "Advice: " + '</strong></h2>';
                setSaveNotes(newValue);
                localStorage.setItem('transcript', newValue);
                if (isAutoListening) {
                    setTimeout(startListening, 500);
                }
            }
        },
        {
            command: 'underline *',
            callback: (underline) => {
                const newValue = saveNotes + '<u>' + underline + '</u>' + ". ";
                setSaveNotes(newValue);
                localStorage.setItem('transcript', newValue);
                stopCommand();
                if (isAutoListening) {
                    setTimeout(startListening, 500);
                }
            }
        },
        {
            command: 'bold face *',
            callback: (point) => {
                const newValue = saveNotes + '<strong>' + point + '</strong>' + ". ";
                setSaveNotes(newValue);
                localStorage.setItem('transcript', newValue);
                stopCommand();
                if (isAutoListening) {
                    setTimeout(startListening, 500);
                }
            }
        },
    ];

    // eslint-disable-next-line

    const [saveNotes, setSaveNotes] = useState(localStorage.getItem('transcript') || []);
    const [isAutoListening, setIsAutoListening] = useState(false);
    const quillRef = useRef(null);
    const textAreaRef = useRef(null);


    const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition({ commands });

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    const startListening = () => {
        resetTranscript();
        SpeechRecognition.startListening({ continuous: true });
    };

    const stopListening = () => {
        SpeechRecognition.stopListening();

        let modifiedTranscript = transcript.replace(/( stop| full stop| period\s*)+/g, '. ');
        modifiedTranscript = modifiedTranscript.replace(/(next\s*line\s*)+/g, '');
        modifiedTranscript = modifiedTranscript.replace(/(comma\s*)+/g, ', ');
        modifiedTranscript = modifiedTranscript.replace(/(hyphen\s*)+/g, '-');
        modifiedTranscript = modifiedTranscript.replace(/( underscore\s*)+/g, '_');
        modifiedTranscript = modifiedTranscript.replace(/(colon\s*)+/g, ': ');
        modifiedTranscript = modifiedTranscript.replace(/(semicolon\s*)+/g, '; ');
        modifiedTranscript = modifiedTranscript.replace(/(question mark\s*)+/g, '? ');
        // modifiedTranscript = modifiedTranscript.replace(/(cubic centimeter\s*)+/g, 'cm3 ');
        modifiedTranscript = modifiedTranscript.replace(/(plus\s*)+/g, '+');
        modifiedTranscript = modifiedTranscript.replace(/(minus\s*)+/g, '-');
        modifiedTranscript = modifiedTranscript.replace(/(multiply\s*)+/g, '*');
        modifiedTranscript = modifiedTranscript.replace(/(divide\s*)+/g, '/');

        modifiedTranscript = modifiedTranscript.charAt(0).toUpperCase() + modifiedTranscript.slice(1);

        const newValue = saveNotes + modifiedTranscript;
        setSaveNotes(newValue);
        localStorage.setItem('transcript', newValue);
        resetTranscript();
    };

    const stopCommand = () => {
        SpeechRecognition.stopListening();
        resetTranscript();
    };

    const handleQuillChange = (content, delta, source, editor) => {
        const html = editor.getHTML();
        setSaveNotes(html)
        localStorage.setItem('transcript', html);

        const quillInstance = quillRef.current.getEditor();
        const scrollLength = quillInstance.scroll.domNode.scrollHeight;
        quillInstance.scroll.domNode.scrollTop = scrollLength;
    };

    const exportToPdf = async () => {
        const quillInstance = quillRef.current.getEditor();
        const delta = quillInstance.getContents();

        const pdfAsBlob = await pdfExporter.generatePdf(delta);
        saveAs(pdfAsBlob, 'pdf-export.pdf');
    }

    const exportToDocx = () => {
        const quillInstance = quillRef.current.getEditor();
        const html = quillInstance.root.innerHTML;

        const converted = htmlDocx.asBlob(html);
        saveAs(converted, 'document.docx');
    }

    const handleTranscriptChange = (newTranscript) => {
        if (textAreaRef.current) {
            textAreaRef.current.scrollTop = textAreaRef.current.scrollHeight;
        }
        return newTranscript;
    };

    return (
        <div className="container">
            <div className="row">
                <div className="editor">
                    <ReactQuill theme="snow" value={saveNotes}
                        onChange={handleQuillChange}
                        className="editor-input"
                        modules={modules}
                        ref={quillRef}
                    />
                </div>
                <div className="button-select-container">
                    <button className="btn1">{listening ? "Listening..." : "Mic: off"}</button>

                    <textarea ref={textAreaRef} value={handleTranscriptChange(transcript)} readOnly style={{ width: '90%' }} />
                </div>

                <br />

                <div className="button-select-container">

                    <button className="btn2" onClick={listening ? stopListening : startListening}>
                        {listening ? 'Stop' : 'Start'}
                    </button>

                    <button className="btn2" onClick={() => setIsAutoListening(!isAutoListening)}>
                        {isAutoListening ? 'Stop Auto' : 'Start Auto'}
                    </button>

                    <button className="btn2" onClick={exportToPdf}>
                        PDF
                    </button>

                    <button className="btn2" onClick={exportToDocx}>
                        DOCX
                    </button>

                </div>

            </div>
        </div>
    )
}

export default AudioRecorder;
