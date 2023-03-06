# SlackGPT Bot

## How to use

1. [Create a Slack App](https://api.slack.com/) and add it to your workspace.
2. Set up your server.
   ```bash
   git clone https://github.com/hanchchch/slack-gpt
   cd slack-gpt
   echo SLACK_BOT_TOKEN=your-slack-bot-token > .env
   echo OPENAI_API_KEY=your-openai-api-key >> .env
   docker-compose up
   ```
3. Set event subscriptions to `https://your-server-url/slack/events`. (at https://api.slack.com/apps/your-slack-app-id/event-subscriptions)
4. Add the bot to a channel.
