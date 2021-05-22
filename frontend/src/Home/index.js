import React from 'react';
import './style_home.css';
import ReactPlayer from 'react-player';

class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
      inputValue: '',
      videoUrl: ''
    };
	}

	handleChange = (event) => {
    this.setState({inputValue: event.target.value});
  }
  
	handleSubmit = (event) => {
    event.preventDefault();
    this.setState({videoUrl: this.state.inputValue});
  }


	render () {
		return (
			<div className="wholePage">
				<div className="container">
					<h1>Hello Bowling Enthusiasts</h1>
					<div>
						<label>

              <form onSubmit={this.handleSubmit}>
                <input type='text' onChange={this.handleChange} placeholder="Escribe el link del video"></input>
                <br /> <br />
                <button>Let's Go!</button>
              </form>
						</label>
            <br /><br />
            <div className="video">
              <ReactPlayer url={this.state.videoUrl} className="video" controls="true" />
            </div>
            <div>
              <div>
                <label>Algo</label>
              </div>
              <div>
              <label>de</label>
              </div>
              <div>
              <label>prueba</label>
              </div>
            </div>
					</div>
				</div>
			</div>
	  );
	}
  	
}

export default Home;