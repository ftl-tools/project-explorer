## Back fill tests

We recently re-organized our design docs. In the process most of the testing notes were lost. Please look through the code, and backfill these. All tests are outlined in "Test that" sections throughout the design docs. These sections should include a bulleted list of the tests to run to test that the related docs have been implemented to spec and all edge cases have been accounted for. You need to back fill these lists, writing a sentence or two for each related, existing test saying what to test.

We don't have complete test coverage yet. There might be some "Test that" sections that have no tests yet. Leave the bulleted lists in these as is.

## Clean up tests

Our design docs have "Test that" sections scattered throughout them with bulleted lists describing, in a sentence or two, what to test to ensure that the implementation fulfills the spec. However many of these suggested tests are a based on an old spec and have fallen out of date, and many others are completely missing.

Please go through all the design docs and clean up each "Test that" section one at a time. For each "Test that" section review the existing tests if any, and make sure they actually match the related spec. Add bullet points if they are missing any details or edge cases that we should be testing for. After that think again about any edge cases or behaviors that you missed, and add those. These bullet points should explain a single thing to test in just a sentence or two.

## Clean up code

The code in this project has fallen out of sync with the design docs a bit. Please work through each design docs one at a time(cross referencing design docs as needed), comparing them to the code and making fixes were needed. Some of the design docs describe features that haven't been implemented yet. Don't add these yet, just fix any existing featrues and tests that are implemented wrong and don't adhere to the design specs.
