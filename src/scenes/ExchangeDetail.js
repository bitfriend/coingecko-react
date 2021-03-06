import React, { PureComponent } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Link,
  Typography,
  withStyles
} from '@material-ui/core';
import {
  AiFillFacebook,
  AiFillRedditSquare,
  AiFillSlackSquare,
  AiFillTwitterSquare
} from 'react-icons/ai';
import { MdExpandMore } from 'react-icons/md';
import { ImTelegram } from 'react-icons/im';
import moment from 'moment';

import { apiRequest } from '../helpers/api';

const styles = (theme) => ({
  root: {
    height: '100vh',
    backgroundColor: '#f5f5f5'
  },
  card: {
    width: '100%'
  },
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10)
  },
  name: {
    width: '100%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  country: {
    width: '100%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  formControl: {
    margin: theme.spacing(2),
    [theme.breakpoints.only('xs')]: {
      margin: theme.spacing(1),
      display: 'block'
    }
  },
  userTitle: {
    [theme.breakpoints.only('xs')]: {
      display: 'none'
    }
  },
  category: {
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  }
});

class ExchangeDetail extends PureComponent {
  state = {
    record: {
      status_updates: [],
      tickers: []
    }
  }

  componentDidMount() {
    this.fetchData(100);
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  fetchData(timeout) {
    this.timer = setTimeout(() => {
      apiRequest({
        url: `https://api.coingecko.com/api/v3/exchanges/${this.props.match.params.id}`,
        method: 'GET',
        onSuccess: (json) => {
          this.setState({ record: json });
        },
        onError: (msg) => {
          console.log(msg);
        },
        onFinish: () => {
          this.fetchData(10000); // automatically iterate fetching
        }
      });
    }, timeout);
  }

  render = () => {
    return (
      <div className={this.props.classes.root}>
        <Grid container>
          <Grid item xl={1} />
          <Grid item xl={10} xs={12}>
            <Box m={1}>
              <Card className={this.props.classes.card}>
                <CardContent>
                  <Grid container>
                    <Grid item md={2} sm={2} xs={4}>
                      <Link href={this.state.record.url}>
                        <Avatar alt="" src={this.state.record.image} variant="square" className={this.props.classes.avatar} />
                      </Link>
                    </Grid>
                    <Grid item md={10} sm={10} xs={8}>
                      <Typography variant="h6" className={this.props.classes.name}>{this.state.record.name}</Typography>
                      <Typography variant="body1" className={this.props.classes.country}>{this.state.record.country}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl component="fieldset" className={this.props.classes.formControl}>
                        <FormControlLabel
                          control={<Checkbox checked={!!this.state.record.centralized} />}
                          label="Centralized"
                        />
                      </FormControl>
                      <FormControl component="fieldset" className={this.props.classes.formControl}>
                        <FormControlLabel
                          control={<Checkbox checked={!!this.state.record.has_trading_incentive} />}
                          label="Has Trading Incentive"
                        />
                      </FormControl>
                      <FormControl component="fieldset" className={this.props.classes.formControl}>
                        <FormLabel>Trade Volume 24h BTC</FormLabel>
                        <Typography variant="body1">{this.state.record.trade_volume_24h_btc}</Typography>
                      </FormControl>
                      <FormControl component="fieldset" className={this.props.classes.formControl}>
                        <FormLabel>Trade Volume 24h BTC Normalized</FormLabel>
                        <Typography variant="body1">{this.state.record.trade_volume_24h_btc_normalized}</Typography>
                      </FormControl>
                      <FormControl component="fieldset" className={this.props.classes.formControl}>
                        <FormLabel>Trust Score</FormLabel>
                        <Typography variant="body1">{this.state.record.trust_score}</Typography>
                      </FormControl>
                      <FormControl component="fieldset" className={this.props.classes.formControl}>
                        <FormLabel>Trust Score Rank</FormLabel>
                        <Typography variant="body1">{this.state.record.trust_score_rank}</Typography>
                      </FormControl>
                      <FormControl component="fieldset" className={this.props.classes.formControl}>
                        <FormLabel>Year Established</FormLabel>
                        <Typography variant="body1">{this.state.record.year_established}</Typography>
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Accordion>
                    <AccordionSummary expandIcon={<MdExpandMore />}>
                      <Typography variant="subtitle1">Status Updates</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box width="100%">
                        <Grid container>
                          <Grid item md={3} sm={4} xs={8}>
                            <Typography variant="subtitle1">Created At</Typography>
                          </Grid>
                          <Grid item md={3} sm={4} xs={4}>
                            <Typography variant="subtitle1">User</Typography>
                          </Grid>
                          <Grid item md={3} sm={4} className={this.props.classes.userTitle}>
                            <Typography variant="subtitle1">User Title</Typography>
                          </Grid>
                          <Grid item md={3} className={this.props.classes.category}>
                            <Typography variant="subtitle1">Category</Typography>
                          </Grid>
                        </Grid>
                        {this.state.record.status_updates.map((item, index) => (
                          <Grid key={index} container>
                            <Grid item md={3} sm={4} xs={8}>
                              <Typography variant="body2">{moment.utc(item.created_at).local().format('llll')}</Typography>
                            </Grid>
                            <Grid item md={3} sm={4} xs={4}>
                              <Typography variant="body2">{item.user}</Typography>
                            </Grid>
                            <Grid item md={3} sm={4} className={this.props.classes.userTitle}>
                              <Typography variant="body2">{item.user_title}</Typography>
                            </Grid>
                            <Grid item md={3} className={this.props.classes.category}>
                              <Typography variant="body2">{item.category}</Typography>
                            </Grid>
                          </Grid>
                        ))}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </CardContent>
                <CardActions style={{ justifyContent: 'center' }}>
                  {!!this.state.record.facebook_url && (
                    <Link href={this.state.record.facebook_url}>
                      <AiFillFacebook size={36} />
                    </Link>
                  )}
                  {!!this.state.record.reddit_url && (
                    <Link href={this.state.record.reddit_url}>
                      <AiFillRedditSquare size={36} />
                    </Link>
                  )}
                  {!!this.state.record.slack_url && (
                    <Link href={this.state.record.slack_url}>
                      <AiFillSlackSquare size={36} />
                    </Link>
                  )}
                  {!!this.state.record.telegram_url && (
                    <Link href={this.state.record.telegram_url}>
                      <ImTelegram size={36} />
                    </Link>
                  )}
                  {!!this.state.record.twitter_handle && (
                    <Link href={`https://www.twitter.com/${this.state.record.twitter_handle}`}>
                      <AiFillTwitterSquare size={36} />
                    </Link>
                  )}
                </CardActions>
              </Card>
            </Box>
          </Grid>
          <Grid item xl={1} />
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(ExchangeDetail);