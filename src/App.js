import { useEffect, useState } from 'react';
import './App.css';
import { Form, Formik, useFormik } from 'formik';

const App = () => {
  const [activeLight, setActiveLight] = useState('red');
  const [isError, setIsError] = useState(false);
  const [trafficLight, setTrafficLight] = useState({
    red: {
      id: '123',
      next: 'yellow',
      color: 'red',
      time: 10,
    },
    yellow: {
      id: '234',
      next: 'green',
      color: 'yellow',
      time: 5,
    },
    green: {
      id: '345',
      next: 'red',
      color: 'green',
      time: 15,
    },
  });
  const [timer, setTimer] = useState(trafficLight[activeLight].time);
  const formik = useFormik({
    initialValues: { color: '', time: '' },
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const handleChange = (e, type) => {
    formik.setFieldValue(type, e.target.value);
  };
  const handleReset = () => {
    formik.resetForm();
    setIsError(false);
  };

  const handleSubmit = (values) => {
    const { color, time } = values;
    if (color === '' || time === '') {
      setIsError(true);
      return;
    }
    setActiveLight(color);
    setTrafficLight((prev) => ({
      ...prev,
      [color]: { ...prev[color], time: parseInt(time) },
    }));
    setIsError(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveLight(trafficLight[activeLight].next);
    }, trafficLight[activeLight].time * 1000);
    setTimer(trafficLight[activeLight].time);

    return () => clearTimeout(timer);
  }, [activeLight]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(timer - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [activeLight, timer]);

  return (
    <div className="main-container">
      <div className="pole">
        <p className="pole-1"></p>
      </div>

      <p className="timer-clock">{String(timer).padStart(2, '0')}</p>
      <div className="traffic-light-container">
        {Object.values(trafficLight).map((light) => (
          <p
            key={`${light.id}-${light.color}`}
            className="light"
            style={{
              backgroundColor: `${light.color}`,
              opacity: `${activeLight === light.color ? 1 : 0.3}`,
              border: '3px solid rgb(255, 255, 255, 0.7)',
            }}
          ></p>
        ))}
        <p
          className="light-indicator"
          style={{ backgroundColor: `${activeLight}` }}
        ></p>
      </div>
      <div className="radio-button-container">
        <Formik>
          <Form
            className="form-container"
            onSubmit={formik.handleSubmit}
            onReset={formik.handleReset}
          >
            <p>
              To change the intervals between lights, select any color below and
              enter the time to wait
            </p>
            {Object.values(trafficLight).map((light) => (
              <div key={`${light.id}-${light.color}`} className="radio-button">
                <input
                  type="radio"
                  name="select-light"
                  value={light.color}
                  id={light.color}
                  checked={formik.values.color === light.color}
                  onChange={(e) => handleChange(e, 'color')}
                />
                <label
                  htmlFor={light.color}
                  style={{
                    color: `${light.color}`,
                    textTransform: 'capitalize',
                    WebkitTextStroke: '0.3px black',
                    fontSize: '22px',
                  }}
                >
                  {light.color}
                </label>
              </div>
            ))}
            <div className="time-to-wait">
              <label htmlFor="time">Time to wait: </label>
              <input
                id="time"
                name="time"
                type="number"
                value={formik.values.time}
                min={1}
                onChange={(e) => handleChange(e, 'time')}
              />
              <button type="submit">Enter</button>
              <button type="reset" onClick={handleReset}>
                reset
              </button>
            </div>
            {isError && (
              <p style={{ color: 'red' }}>
                please select both color and time to update
              </p>
            )}
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default App;
