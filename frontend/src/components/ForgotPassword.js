import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Redirect, Link } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import { Button, Grid, Paper, TextField, Typography } from '@material-ui/core'
import ErrorMessage from './ErrorMessage'
import { forgotPassword } from '../actions/auth'

const styles = theme => ({
  root: {
    background: 'linear-gradient(to right, #E2842D, #E2E22D)',
    display: 'flex',
    flexDirection: 'column',
    minWidth: '100%',
    minHeight: '100vh',
    alignItems: 'center',
    justifyContent: 'center'
  },
  paper: {
    minWidth: '300px',
    padding: theme.spacing.unit * 2
  },
  input: {
    width: '100%'
  },
  button: {
    width: '100%',
    marginTop: theme.spacing.unit
  }
})

class ForgotPassword extends Component {
  state = {
    email: ''
  }

  validate = () => this.state.email.length > 0

  handleChange = ({ target: { id, value } }) => this.setState({ [id]: value })

  handleSubmit = event => {
    event.preventDefault()
    this.props.dispatch(forgotPassword(this.state.email))
  }

  render() {
    const { classes } = this.props
    const { resetError, resetRequested } = this.props.auth

    const errorItem =
      !resetRequested && resetError ? (
        <Grid item>
          <ErrorMessage messageId={resetError.id} />
        </Grid>
      ) : null

    return (
      <div className={classes.root}>
        <form onSubmit={this.handleSubmit}>
          <Paper className={classes.paper}>
            <Grid
              container
              direction="column"
              justify="center"
              alignItems="stretch"
              spacing={8}
            >
              <Grid item align="center">
                <Typography variant="h3">
                  Password <br /> Reset
                </Typography>
              </Grid>
              <Grid item>
                <TextField
                  className={classes.input}
                  id="email"
                  label="Email"
                  autoComplete="username"
                  onChange={this.handleChange}
                />
              </Grid>
              {errorItem}
              <Grid item>
                <Button
                  variant="contained"
                  color="secondary"
                  type="submit"
                  id="forgotPassword-btn"
                  className={classes.button}
                  disabled={!this.validate()}
                >
                  Reset Password
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </form>
      </div>
    )
  }
}

ForgotPassword.propTypes = {
  dispatch: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
}

const mapStateToProps = ({ auth }) => ({ auth })

export default connect(mapStateToProps)(withStyles(styles)(ForgotPassword))
